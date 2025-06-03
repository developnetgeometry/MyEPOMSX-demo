import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import UptimeEntryModal from "./UptimeEntryModal";

// Sample data
const uptimeData = [
  {
    id: "1",
    assetId: "RMS-A001",
    assetName: "Compressor Station Alpha",
    data: [
      {
        id: "1-1",
        date: "2025-05-11",
        upTime: 23.5,
        sumRunningHour: 23.5,
        standby: 0.0,
        unplannedShutdown: 0.5,
        plannedShutdown: 0.0,
        description: "Brief power fluctuation",
      },
      {
        id: "1-2",
        date: "2025-05-10",
        upTime: 24.0,
        sumRunningHour: 24.0,
        standby: 0.0,
        unplannedShutdown: 0.0,
        plannedShutdown: 0.0,
        description: "Normal operation",
      },
      {
        id: "1-3",
        date: "2025-05-09",
        upTime: 18.5,
        sumRunningHour: 18.5,
        standby: 0.0,
        unplannedShutdown: 0.0,
        plannedShutdown: 5.5,
        description: "Scheduled maintenance",
      },
    ],
  },
  {
    id: "5",
    assetId: "RMS-A005",
    assetName: "Pump Motor Temperature Sensor",
    data: [
      {
        id: "5-1",
        date: "2025-05-11",
        upTime: 20.0,
        sumRunningHour: 20.0,
        standby: 0.0,
        unplannedShutdown: 4.0,
        plannedShutdown: 0.0,
        description: "Sensor calibration failure",
      },
      {
        id: "5-2",
        date: "2025-05-10",
        upTime: 15.5,
        sumRunningHour: 15.5,
        standby: 0.0,
        unplannedShutdown: 8.5,
        plannedShutdown: 0.0,
        description: "Overheating event",
      },
      {
        id: "5-3",
        date: "2025-05-09",
        upTime: 24.0,
        sumRunningHour: 24.0,
        standby: 0.0,
        unplannedShutdown: 0.0,
        plannedShutdown: 0.0,
        description: "Normal operation",
      },
    ],
  },
];

interface CriticalAssetSummaryProps {
  className?: string;
}

const CriticalAssetSummary: React.FC<CriticalAssetSummaryProps> = ({
  className,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string>("1");
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date("2025-05-09")
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date("2025-05-11")
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const asset = uptimeData.find((a) => a.id === selectedAsset);

  const handleSaveUptimeData = (assetId: string, entries: any[]) => {
    // In a real application, this would save to a database
    console.log("Saving uptime data for asset:", assetId, entries);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Critical Asset Summary</CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>
              Edit Uptime Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Asset
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                {uptimeData.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.assetName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Up Time (hrs)</TableHead>
                  <TableHead>Sum Running Hour</TableHead>
                  <TableHead>Standby</TableHead>
                  <TableHead>Unplanned Shutdown (hrs)</TableHead>
                  <TableHead>Planned Shutdown (hrs)</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!asset || asset.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-gray-500"
                    >
                      No data available for selected asset and date range
                    </TableCell>
                  </TableRow>
                ) : (
                  asset.data.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{asset.assetName}</TableCell>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>{entry.upTime}</TableCell>
                      <TableCell>{entry.sumRunningHour}</TableCell>
                      <TableCell>{entry.standby}</TableCell>
                      <TableCell>
                        <span
                          className={
                            entry.unplannedShutdown > 0
                              ? "text-red-500 font-semibold"
                              : ""
                          }
                        >
                          {entry.unplannedShutdown}
                        </span>
                      </TableCell>
                      <TableCell>{entry.plannedShutdown}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {asset && (
        <UptimeEntryModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          assetId={asset.id}
          assetName={asset.assetName}
          initialData={asset.data.map((d) => ({
            id: d.id,
            date: d.date,
            upTime: d.upTime,
            unplannedShutdown: d.unplannedShutdown,
            plannedShutdown: d.plannedShutdown,
            description: d.description,
          }))}
          onSave={handleSaveUptimeData}
        />
      )}
    </div>
  );
};

export default CriticalAssetSummary;
