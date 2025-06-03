import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Sample data for critical assets
const criticalAssetsData = [
  {
    id: "1",
    assetName: "Compressor Station Alpha",
    assetNo: "RMS-A001",
    metric1Name: "Temperature",
    metric1Value: 92.5,
    metric1Threshold: 90.0,
    metric1Unit: "°C",
    metric2Name: "Vibration",
    metric2Value: 2.8,
    metric2Threshold: 3.0,
    metric2Unit: "mm/s",
    thresholdExceeded: true,
    alertLevel: "Warning",
    lastUpdated: "2025-05-12 09:15:22",
  },
  {
    id: "2",
    assetName: "Flow Control Valve FCV-201",
    assetNo: "RMS-A002",
    metric1Name: "Pressure",
    metric1Value: 13.8,
    metric1Threshold: 13.5,
    metric1Unit: "MPa",
    metric2Name: "Flow Rate",
    metric2Value: 120.5,
    metric2Threshold: 125.0,
    metric2Unit: "m³/h",
    thresholdExceeded: true,
    alertLevel: "Warning",
    lastUpdated: "2025-05-12 08:45:30",
  },
  {
    id: "3",
    assetName: "Pressure Transmitter PT-305",
    assetNo: "RMS-A003",
    metric1Name: "Accuracy",
    metric1Value: 1.8,
    metric1Threshold: 1.5,
    metric1Unit: "%",
    metric2Name: "Power Consumption",
    metric2Value: 0.65,
    metric2Threshold: 0.5,
    metric2Unit: "W",
    thresholdExceeded: true,
    alertLevel: "Warning",
    lastUpdated: "2025-05-11 23:10:45",
  },
  {
    id: "4",
    assetName: "Storage Tank Level Sensor",
    assetNo: "RMS-A004",
    metric1Name: "Battery Level",
    metric1Value: 72,
    metric1Threshold: 20,
    metric1Unit: "%",
    metric2Name: "Signal Strength",
    metric2Value: 85,
    metric2Threshold: 60,
    metric2Unit: "%",
    thresholdExceeded: false,
    alertLevel: "Normal",
    lastUpdated: "2025-05-12 10:30:15",
  },
  {
    id: "5",
    assetName: "Pump Motor Temperature Sensor",
    assetNo: "RMS-A005",
    metric1Name: "Temperature",
    metric1Value: 110.5,
    metric1Threshold: 95.0,
    metric1Unit: "°C",
    metric2Name: "Current",
    metric2Value: 42.3,
    metric2Threshold: 40.0,
    metric2Unit: "A",
    thresholdExceeded: true,
    alertLevel: "Critical",
    lastUpdated: "2025-05-12 07:50:38",
  },
  {
    id: "6",
    assetName: "Cooling Tower Fan Motor",
    assetNo: "RMS-A006",
    metric1Name: "RPM",
    metric1Value: 1450,
    metric1Threshold: 1500,
    metric1Unit: "rpm",
    metric2Name: "Vibration",
    metric2Value: 2.2,
    metric2Threshold: 3.5,
    metric2Unit: "mm/s",
    thresholdExceeded: false,
    alertLevel: "Normal",
    lastUpdated: "2025-05-12 11:22:05",
  },
];

const CriticalAssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Filter assets based on search, date range, and active tab
  const filteredAssets = criticalAssetsData.filter((asset) => {
    // Filter by search term
    const matchesSearch =
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.metric1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.metric2Name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by alert level
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "normal" && asset.alertLevel === "Normal") ||
      (activeTab === "warning" && asset.alertLevel === "Warning") ||
      (activeTab === "critical" && asset.alertLevel === "Critical");

    // Filter by date range (simplified - would need proper date parsing in real app)
    // For the demo, we'll just return true for the date filter
    const matchesDateRange = true;

    return matchesSearch && matchesTab && matchesDateRange;
  });

  const handleRowClick = (assetId: string) => {
    navigate(`/monitor/rms-asset-detail/${assetId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Critical Assets Tracking"
        subtitle="Monitor status of critical assets and thresholds"
        icon={<AlertTriangle className="h-6 w-6" />}
      />

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="start-date" className="whitespace-nowrap">
              Start Date:
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="end-date" className="whitespace-nowrap">
              End Date:
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => (startDate ? date < startDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setSearchTerm("");
            }}
            variant="ghost"
            size="icon"
            className="mt-1 md:mt-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21h5v-5"></path>
            </svg>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="normal">Normal</TabsTrigger>
          <TabsTrigger value="warning">Warning</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <AssetTable assets={filteredAssets} onRowClick={handleRowClick} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="normal" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <AssetTable assets={filteredAssets} onRowClick={handleRowClick} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warning" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <AssetTable assets={filteredAssets} onRowClick={handleRowClick} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <AssetTable assets={filteredAssets} onRowClick={handleRowClick} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AssetTableProps {
  assets: typeof criticalAssetsData;
  onRowClick: (assetId: string) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ assets, onRowClick }) => {
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Name</TableHead>
            <TableHead>Metric 1</TableHead>
            <TableHead>Metric 1 Value</TableHead>
            <TableHead>Metric 1 Threshold</TableHead>
            <TableHead>Metric 2</TableHead>
            <TableHead>Metric 2 Value</TableHead>
            <TableHead>Metric 2 Threshold</TableHead>
            <TableHead>Threshold Exceeded</TableHead>
            <TableHead>Alert Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                No critical assets found matching the criteria
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow
                key={asset.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onRowClick(asset.id)}
              >
                <TableCell className="font-medium">{asset.assetName}</TableCell>
                <TableCell>{asset.metric1Name}</TableCell>
                <TableCell
                  className={
                    asset.metric1Value > asset.metric1Threshold
                      ? "text-red-500 font-bold"
                      : ""
                  }
                >
                  {asset.metric1Value} {asset.metric1Unit}
                </TableCell>
                <TableCell>
                  {asset.metric1Threshold} {asset.metric1Unit}
                </TableCell>
                <TableCell>{asset.metric2Name}</TableCell>
                <TableCell
                  className={
                    asset.metric2Value > asset.metric2Threshold
                      ? "text-red-500 font-bold"
                      : ""
                  }
                >
                  {asset.metric2Value} {asset.metric2Unit}
                </TableCell>
                <TableCell>
                  {asset.metric2Threshold} {asset.metric2Unit}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      asset.thresholdExceeded ? "bg-red-500" : "bg-green-500"
                    }
                  >
                    {asset.thresholdExceeded ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      asset.alertLevel === "Critical"
                        ? "bg-red-500"
                        : asset.alertLevel === "Warning"
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }
                  >
                    {asset.alertLevel}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CriticalAssetsPage;
