import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  MoreVertical,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface UptimeEntry {
  id: string;
  date: Date | string;
  upTime: number;
  unplannedShutdown: number;
  plannedShutdown: number;
  description: string;
}

interface UptimeEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
  assetName: string;
  initialData?: UptimeEntry[];
  onSave: (assetId: string, entries: UptimeEntry[]) => void;
}

const UptimeEntryModal: React.FC<UptimeEntryModalProps> = ({
  open,
  onOpenChange,
  assetId,
  assetName,
  initialData = [],
  onSave,
}) => {
  const [entries, setEntries] = useState<UptimeEntry[]>(initialData);
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);

  const handleAddRow = () => {
    const newEntry: UptimeEntry = {
      id: `new-${Date.now()}`,
      date: new Date(),
      upTime: 24,
      unplannedShutdown: 0,
      plannedShutdown: 0,
      description: "",
    };
    setEntries([...entries, newEntry]);
  };

  const handleDeleteRow = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleDateChange = (date: Date | undefined, id: string) => {
    if (!date) return;

    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, date } : entry))
    );
    setActivePopoverId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: keyof UptimeEntry
  ) => {
    const value =
      field === "description"
        ? e.target.value
        : parseFloat(e.target.value) || 0;

    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSave = () => {
    onSave(assetId, entries);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Uptime Entry for {assetName}</DialogTitle>
          <DialogDescription>
            Manage uptime data for this asset. Add, edit or delete entries as
            needed.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Up Time (hrs)</TableHead>
                <TableHead>Unplanned Shutdown (hrs)</TableHead>
                <TableHead>Planned Shutdown (hrs)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-gray-500"
                  >
                    No entries yet. Add a new row to begin.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Popover
                        open={activePopoverId === entry.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setActivePopoverId(entry.id);
                          } else {
                            setActivePopoverId(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !entry.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {entry.date ? (
                              formatDate(entry.date)
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              entry.date instanceof Date
                                ? entry.date
                                : new Date(entry.date)
                            }
                            onSelect={(date) =>
                              handleDateChange(date, entry.id)
                            }
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        step="0.1"
                        value={entry.upTime}
                        onChange={(e) =>
                          handleInputChange(e, entry.id, "upTime")
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        step="0.1"
                        value={entry.unplannedShutdown}
                        onChange={(e) =>
                          handleInputChange(e, entry.id, "unplannedShutdown")
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        step="0.1"
                        value={entry.plannedShutdown}
                        onChange={(e) =>
                          handleInputChange(e, entry.id, "plannedShutdown")
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={entry.description}
                        onChange={(e) =>
                          handleInputChange(e, entry.id, "description")
                        }
                        placeholder="Description"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" onClick={handleAddRow}>
            <Plus className="h-4 w-4 mr-1" /> Add Row
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UptimeEntryModal;
