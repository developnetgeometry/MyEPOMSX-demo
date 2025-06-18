import React, { useEffect, useRef, useState } from "react";
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
  Upload,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";
import * as XLSX from 'xlsx'
import { useRMSUptime, type UptimeEntry } from "@/hooks/monitor/useRMSUptime";
import { toast } from '@/hooks/use-toast';

// interface UptimeEntry {
//   id: string;
//   date: Date | string;
//   upTime: number;
//   unplannedShutdown: number;
//   plannedShutdown: number;
//   description: string;
// }

// interface UptimeEntryModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   assetId: string;
//   assetName: string;
//   initialData?: UptimeEntry[];
//   onSave: (assetId: string, entries: UptimeEntry[]) => void;
// }

interface UptimeEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
  assetDetailId: number;
  assetName: string;
  onSave?: (assetId: string, entries: UptimeEntry[]) => void;
}

const UptimeEntryModal: React.FC<UptimeEntryModalProps> = ({
  open,
  onOpenChange,
  assetId,
  assetDetailId,
  assetName,
  onSave,
}) => {
  const [entries, setEntries] = useState<UptimeEntry[]>([]);
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uptimeData,
    saveUptimeEntries,
    isSaving,
    loading,
    refetch
  } = useRMSUptime(assetDetailId);

  // Load existing data when modal opens
  useEffect(() => {
    if (open && uptimeData.length > 0) {
      const convertedEntries: UptimeEntry[] = uptimeData.map((data, index) => ({
        id: data.id?.toString() || `existing-${index}`,
        date: new Date(data.date),
        uptime: data.uptime,
        unplanned_shutdown: data.unplanned_shutdown,
        planned_shutdown: data.planned_shutdown,
        asset_detail_id: data.asset_detail_id,
        description: data.description || ""
      }));

      setEntries(convertedEntries);
    } else if (open && uptimeData.length === 0) {
      setEntries([]);
    }
  }, [open, uptimeData]);

  const handleAddRow = () => {
    const newEntry: UptimeEntry = {
      id: `new-${Date.now()}`,
      date: new Date(),
      uptime: 24,
      unplanned_shutdown: 0,
      planned_shutdown: 0,
      asset_detail_id: assetDetailId,
      description: "",
    };
    setEntries([...entries, newEntry]);
  };

  const handleDeleteRow = (id: string) => {
    // setEntries(entries.filter((entry) => entry.id !== id));
    setEntries(prevEntries => prevEntries.filter((entry) => entry.id !== id));
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

  // function to handle csv / excel load data
  const handleDataLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const processedEntries = processImportedData(jsonData);

        // Add processed entries to existing entries
        setEntries(prev => [...prev, ...processedEntries]);

        toast({
          title: "Data loaded successfully.",
          description: `Imported ${processedEntries.length} records from file.`,
        });
      } catch (error) {
        console.error('Error processing file:', error);

        toast({
          title: "Import Error",
          description: "Failed to process the upload file. Please check the file format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
    
    // Reset the input
    event.target.value = '';
  };

  const processImportedData = (data: any[]): UptimeEntry[] => {
    if (!data || data.length < 2) return [];

    // Find header row
    let headerRowIndex = -1;
    let headers: string[] = [];

    for (let i = 0; i < Math.min(5, data.length); i++) {
      const row = data[i];
      if (Array.isArray(row)) {
        const rowStr = row.join('').toLowerCase();
        if (rowStr.includes('equipment_date') || rowStr.includes('up_time') ||
            rowStr.includes('uptime') || rowStr.includes('date')) {
              headerRowIndex = i;
              headers = row.map((h:any) => String(h).toLowerCase().trim());
              break;
        }
      }
    }

    if (headerRowIndex === -1) {
      // If no header found, assume first row is header
      headerRowIndex = 0;
      headers = data[0].map((h: any) => String(h).toLowerCase().trim());
    }

    // Find column indices
    const dateColIndex = headers.findIndex(h =>
      h.includes('date') || h.includes('equipment_date') || h.includes('historical_equipment_date')
    );

    const uptimeColIndex = headers.findIndex(h =>
      h.includes('up_time') || h.includes('uptime')
    );

    const unplannedColIndex = headers.findIndex(h =>
      h.includes('unplanned_shutdown')
    );

    const plannedColIndex = headers.findIndex(h =>
      h.includes('planned_shutdown') && !h.includes('unplanned_shutdown')
    );

    if (dateColIndex === -1 || uptimeColIndex === -1) {
      throw new Error('Required columns (date, uptime) not found in the file');
    }

    // Process data rows
    const processedEntries: UptimeEntry[] = [];
    const existingDates = new Set(entries.map(entry => {
        const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
        return entryDate.toISOString().split('T')[0];
    }));

    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      if (!Array.isArray(row) || row.length === 0) continue;

      // SKip empty rows
      if (row.every(cell => !cell || String(cell).trim() === '')) continue;

      const dateValue = row[dateColIndex];
      const uptimeValue = row[uptimeColIndex];

      if (!dateValue || uptimeValue === undefined || uptimeValue === null) continue;

      try {
        // Parse date - handle various formats
        let parsedDate: Date;

        if (typeof dateValue === 'number') {
          // Excel date serial number - convert to JS date
          const excelEpoch = new Date(1900, 0, 1);
          parsedDate = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
        } else {
          // String date
          const dateStr = String(dateValue).trim();

          // Parse as is first
          parsedDate = new Date(dateStr);

          if (isNaN(parsedDate.getTime())) {
            // DD/MM/YYYY format
            const parts = dateStr.split('/');
            if(parts.length === 3) {
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]) - 1;
              const year = parseInt(parts[2]);

              // Validate the parts
              if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year > 1900) {
                parsedDate = new Date(year, month, day);
              } else {
                continue; // Skip invalid dates
              }
            } else {
              // Try other common separators
              const dashParts =  dateStr.split('-');
              const dotParts = dateStr.split('.');

              if(dashParts.length === 3) {
                // Handle DD-MM-YYYY format
                const day = parseInt(dashParts[0]);
                const month = parseInt(dashParts[1]) - 1;
                const year = parseInt(dashParts[2]);

                if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year > 1900) {
                  parsedDate = new Date(year, month, day);
                } else {
                  continue; // Skip invalid dates
                }
              } else if (dotParts.length === 3) {
                // Handle DD.MM.YYYY format
                const day = parseInt(dotParts[0]);
                const month = parseInt(dotParts[1]) - 1;
                const year = parseInt(dotParts[2]);

                if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year > 1900) {
                  parsedDate = new Date(year, month, day);
                } else {
                  continue; // Skip invalid dates
                }
              } else {
                continue;
              }
            }
          }
        }

        if (isNaN(parsedDate.getTime())) continue;

        const dateString = parsedDate.toISOString().split('T')[0];

        // Skip if date already exists
        // if (existingDates.has(dateString)) {
        //     console.warn(`Skipping duplicate date: ${dateString}`);
        //     continue;
        // }

        const uptime = uptimeValue !== null && uptimeValue !== undefined ? 
          (typeof uptimeValue === 'number' ? uptimeValue : parseFloat(String(uptimeValue))) : 0;

        const unplannedShutdown = unplannedColIndex !== -1 && row[unplannedColIndex] !== null && row[unplannedColIndex] !== undefined ? 
          (typeof row[unplannedColIndex] === 'number' ? row[unplannedColIndex] : parseFloat(String(row[unplannedColIndex]))) : 0;

          const plannedShutdownRaw = plannedColIndex !== -1 ? row[plannedColIndex] : 0;

        let plannedShutdown = 0;

        if (plannedColIndex !== -1 && plannedShutdownRaw !== null && plannedShutdownRaw !== undefined) {
          if (typeof plannedShutdownRaw === 'number') {
            plannedShutdown = plannedShutdownRaw;
          } else {
            const stringValue = String(plannedShutdownRaw).trim();
            plannedShutdown = parseFloat(stringValue);
          }
        }

        processedEntries.push({
          id: `imported-${Date.now()}-${i}`,
          date: parsedDate,
          uptime: uptime,
          unplanned_shutdown: unplannedShutdown,
          planned_shutdown: plannedShutdown,
          asset_detail_id: assetDetailId,
          description: ""
        });

        // Add to existing dates set
        existingDates.add(dateString);
        
      } catch (error) {
        console.warn(`Skipping row ${i} due to parsing error:`, error);
        continue;
      }
    }

    return processedEntries;
  };

  const handleSave = async () => {
    try {
      await saveUptimeEntries(entries);

      if (onSave) {
        onSave(assetId, entries);
      }

      // Refresh data and close modal
      await refetch();
      onOpenChange(false);

      toast({
        title: "Success",
        description: "Uptime data saved successfully.",
      });
    } catch (error) {
      console.error('Save error:', error);

      toast({
        title: "Save Error",
        description: "Failed to save uptime data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset entries to original data
    if (uptimeData.length > 0) {
      const originalEntries: UptimeEntry[] = uptimeData.map((data, index) => ({
        id: data.id?.toString() || `existing-${index}`,
        date: new Date(data.date),
        uptime: data.uptime,
        unplanned_shutdown: data.unplanned_shutdown,
        planned_shutdown: data.planned_shutdown,
        asset_detail_id: data.asset_detail_id,
        description: data.description || ""
      }));

      setEntries(originalEntries);
    } else {
      setEntries([]);
    }
    
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Uptime Entry for {assetName}</DialogTitle>
            <DialogDescription>
              Manage uptime data for this asset. Add, edit or delete entries as needed.
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
                      {loading ? 'Loading uptime data...' : 'No entries yet. Add a new row to begin or load data from file.'}
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
                          value={entry.uptime}
                          onChange={(e) =>
                            handleInputChange(e, entry.id, "uptime")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.1"
                          value={entry.unplanned_shutdown}
                          onChange={(e) =>
                            handleInputChange(e, entry.id, "unplanned_shutdown")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.1"
                          value={entry.planned_shutdown}
                          onChange={(e) =>
                            handleInputChange(e, entry.id, "planned_shutdown")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={entry.description || ''}
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleAddRow}>
                <Plus className="h-4 w-4 mr-1" /> Add Row
              </Button>
              <Button variant="outline" size="sm" onClick={handleDataLoad}>
                <Upload className="h-4 w-4 mr-1" /> Data Load
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || loading}>
                {isSaving ? "Saving..." : "Save Changes" }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default UptimeEntryModal;
