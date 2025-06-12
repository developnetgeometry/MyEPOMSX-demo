import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { formatDateTime } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAssets } from "@/hooks/monitor/useAssets";
import { useAssetsWithUptimeDate, useUptimeDataForAsset } from "@/hooks/monitor/useCriticalAssetSummary";
import { string } from "zod";

interface CriticalAssetDisplay {
  id: string;
  assetName: string;
  assetNo: string;
  code: string;
  date: string;
  upTime: number;
  sumRunningHour: number;
  standBy: number;
  unplannedShutdown: number;
  plannedShutdown: number;
  description: string;
  asset_detail_id: number;
  lastUpdated: string;
}

interface SummaryData {
  totalUpTime: number;
  totalStandBy: number;
  totalRunningHour: number;
  assetUtilization: number;
  assetAvailability: number;
  assetReliability: number;
}

const CriticalAssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedAssetDetailId, setSelectedAssetDetailId] = useState<number | undefined>(undefined);

  // Fetch assets data
  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: assetsWithUptime = [], isLoading: uptimeAssetsLoading } = useAssetsWithUptimeDate();
  
  // Fetch uptime data for selected asset
  const { data: uptimeData = [], isLoading: uptimeLoading } = useUptimeDataForAsset(
    selectedAssetDetailId || 0, 
    startDate, 
    endDate
  );

  // Set default asset if none selected
  useEffect(() => {
    if (!selectedAssetDetailId && assetsWithUptime && assetsWithUptime.length > 0) {
      setSelectedAssetDetailId(assetsWithUptime[0].asset_detail_id);
    }
  }, [assetsWithUptime, selectedAssetDetailId]);

  // Transform data for display
  const criticalAssetsData: CriticalAssetDisplay[] = React.useMemo(() => {
    if (!selectedAssetDetailId || uptimeData.length === 0) return [];

    const selectedAsset = assets.find(asset => asset.asset_detail_id === selectedAssetDetailId);
    
    return uptimeData.map((uptime, index) => ({
      id: uptime.id || index.toString(),
      assetName: selectedAsset?.asset_name || 'Unknown Asset',
      assetNo: selectedAsset?.asset_no || 'Unknown',
      code: '',
      date: uptime.date,
      upTime: uptime.upTime || 0,
      sumRunningHour: uptime.sumRunningHour || 0,
      standBy: uptime.standby || 0,
      unplannedShutdown: uptime.unplannedShutdown || 0,
      plannedShutdown: uptime.plannedShutdown || 0,
      description: uptime.description || '',
      asset_detail_id: selectedAssetDetailId,
      lastUpdated: formatDateTime(new Date().toISOString()),
    }));
  }, [selectedAssetDetailId, uptimeData, assets]);

  // Filter by date range only
  const filteredAssets = criticalAssetsData.filter((asset) => {
    let matchesDateRange = true;
    if (startDate || endDate) {
      const assetDate = new Date(asset.date);
      if (startDate && assetDate < startDate) matchesDateRange = false;
      if (endDate && assetDate > endDate) matchesDateRange = false;
    }

    return matchesDateRange;
  });

  const handleRowClick = (assetId: string) => {
    const selectedAsset = assets.find(asset => asset.asset_detail_id === selectedAssetDetailId);
    if (selectedAsset) {
      navigate(`/monitor/rms-asset-detail/${selectedAsset.id}`);
    }
  };

  const AssetSelectorSimple = () => (
    <div className="flex items-center">
      <Label htmlFor="asset-select">Select Asset:</Label>
      <Select 
        value={selectedAssetDetailId?.toString() || ""} 
        onValueChange={(value) => setSelectedAssetDetailId(Number(value))}
      >
        <SelectTrigger className="ml-2 w-[400px]">
          <SelectValue placeholder="Select an asset..." />
        </SelectTrigger>
        <SelectContent>
          {assetsWithUptime && assetsWithUptime.length > 0 ? (
            assetsWithUptime.map((asset) => (
              <SelectItem 
                key={asset.asset_detail_id} 
                value={asset.asset_detail_id.toString()}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{asset.assetName || 'Unknown Asset'}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>No assets available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );

  const summaryData: SummaryData = React.useMemo(() => {
    if (filteredAssets.length === 0) {
      return {
        totalUpTime: 0,
        totalStandBy: 0,
        totalRunningHour: 0,
        assetUtilization: 0,
        assetAvailability: 0,
        assetReliability: 0,
      };
    }

    // Calculate totals
    const totalUpTime = filteredAssets.reduce((sum, asset) => sum + asset.upTime, 0);
    const totalRunningHour = filteredAssets.reduce((sum, asset) => sum + asset.sumRunningHour, 0);
    const totalUnplannedShutdown = filteredAssets.reduce((sum, asset) => sum + asset.unplannedShutdown, 0);
    const totalPlannedShutdown = filteredAssets.reduce((sum, asset) => sum + asset.plannedShutdown, 0);
    
    // Calculate standby for each asset: 24 - (Uptime + USD + PSD)
    const totalStandBy = filteredAssets.reduce((sum, asset) => {
      const standby = 24 - (asset.upTime + asset.unplannedShutdown + asset.plannedShutdown);
      return sum + Math.max(0, standby); // Ensure standby is not negative
    }, 0);

    // Get total days (number of records represents days)
    const totalDays = filteredAssets.length;
    const totalHoursInPeriod = totalDays * 24;

    // Calculate metrics
    const assetUtilization = totalHoursInPeriod > 0 
      ? (totalRunningHour / totalHoursInPeriod) * 100 
      : 0;

    const assetAvailability = totalHoursInPeriod > 0 
      ? ((totalRunningHour + totalStandBy) / totalHoursInPeriod) * 100 
      : 0;

    const assetReliability = (totalHoursInPeriod - totalPlannedShutdown) > 0 
      ? (((totalHoursInPeriod - totalUnplannedShutdown - totalPlannedShutdown) / (totalHoursInPeriod - totalPlannedShutdown)) * 100)
      : 0;

    return {
      totalUpTime,
      totalStandBy,
      totalRunningHour,
      assetUtilization,
      assetAvailability,
      assetReliability,
    };
  }, [filteredAssets]);

  if (assetsLoading || uptimeAssetsLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Critical Assets Tracking"
          subtitle="Monitor status of critical assets and thresholds"
          icon={<AlertTriangle className="h-6 w-6" />}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading assets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Critical Assets Tracking"
        subtitle="Monitor status of critical assets and thresholds"
        icon={<AlertTriangle className="h-6 w-6" />}
      />

      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <AssetSelectorSimple />
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

      <Card>
        <CardContent className="p-6">
          <AssetTable 
            assets={filteredAssets} 
            onRowClick={handleRowClick}
            loading={uptimeLoading}
          />
          <SummarySection summaryData={summaryData} />
        </CardContent>
      </Card>
    </div>
  );
};

const SummarySection: React.FC<{ summaryData: SummaryData }> = ({ summaryData }) => (
  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg">
      <h3 className="font-medium">Summary</h3>
    </div>
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Total Up Time</span>
        <span className="font-semibold text-lg">{summaryData.totalUpTime.toFixed(1)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Total Stand by</span>
        <span className="font-semibold text-lg">{summaryData.totalStandBy.toFixed(1)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Total Running Hour</span>
        <span className="font-semibold text-lg">{summaryData.totalRunningHour.toFixed(1)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Asset Utilization</span>
        <span className="font-semibold text-lg">{summaryData.assetUtilization.toFixed(2)}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Asset Availability %</span>
        <span className="font-semibold text-lg">{summaryData.assetAvailability.toFixed(2)}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Asset Reliability %</span>
        <span className="font-semibold text-lg">{summaryData.assetReliability.toFixed(2)}%</span>
      </div>
    </div>
  </div>
);

interface AssetTableProps {
  assets: CriticalAssetDisplay[];
  onRowClick: (assetId: string) => void;
  loading?: boolean;
}

const AssetTable: React.FC<AssetTableProps> = ({ assets, onRowClick, loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg">Loading uptime data...</div>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Up Time</TableHead>
            <TableHead>Sum Running Hour</TableHead>
            <TableHead>Stand By</TableHead>
            <TableHead>Unplanned Shutdown</TableHead>
            <TableHead>Planned Shutdown</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                {loading ? "Loading data..." : "No uptime data found for the selected criteria"}
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
                <TableCell className="font-medium">{asset.code || '-'}</TableCell>
                <TableCell>
                  {new Date(asset.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>{asset.upTime.toFixed(2)}</TableCell>
                <TableCell>{asset.sumRunningHour.toFixed(2)}</TableCell>
                <TableCell>{asset.standBy.toFixed(2)}</TableCell>
                <TableCell>{asset.unplannedShutdown.toFixed(2)}</TableCell>
                <TableCell>{asset.plannedShutdown.toFixed(2)}</TableCell>
                <TableCell>{asset.description || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CriticalAssetsPage;
