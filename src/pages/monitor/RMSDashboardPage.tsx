import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  ReferenceLine,
} from "recharts";
import KpiCard from "@/components/shared/KpiCard";
import {
  Calendar,
  Database,
  Activity,
  AlertTriangle,
  Gauge,
  Settings,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, subDays } from "date-fns";
import { formatPercentage } from "@/utils/formatters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/monitor/useAssets";
import { useAssetsWithUptimeDate } from "@/hooks/monitor/useCriticalAssetSummary";
import { useRMSUptimeData } from "@/hooks/monitor/useRMSDashboardData";
import { DateRange } from "react-day-picker";

interface AssetPerformanceData {
  name: string;
  utilization: number;
  availability: number;
  reliability: number;
  target: number;
  systemId?: number;
  assetCount?: number;
}

interface AverageMetricsData {
  name: string;
  utilization: number;
  availability: number;
  reliability: number;
}

interface SystemReliabilityData {
  name: string;
  availability: number;
  reliability: number;
}

// Fix the type error with the tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {(entry.value as number).toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RMSDashboardPage = () => {
  const [filterType, setFilterType] = useState<"year" | "dateRange">("year");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [tempDateRange, setTempDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [appliedDateRange, setAppliedDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [reliabilityTarget, setReliabilityTarget] = useState(95);

  // Calculate the actual date range based on filter type
  const dateRange = useMemo(() => {
    if (filterType === "year") {
      const startOfYear = new Date(selectedYear, 0, 1);
      const endOfYear = new Date(selectedYear, 11, 31);

      return {
        from: startOfYear, // January 1st
        to: endOfYear, // December 31st
      };
    } else {
      return appliedDateRange;
    }
  }, [filterType, selectedYear, appliedDateRange]);

  const applyDateRange = () => {
    if (tempDateRange.from && tempDateRange.to) {
      setAppliedDateRange({
        from: new Date(tempDateRange.from),
        to: new Date(tempDateRange.to),
      });
    }
  };

  const switchToYearFilter = (year: number) => {
    setSelectedYear(year);
    setFilterType("year");
  };

  const switchToDateRangeFilter = () => {
    setFilterType("dateRange");
  };

  // Fetch data
  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: assetsWithUptime = [], isLoading: uptimeAssetsLoading } =
    useAssetsWithUptimeDate();
  const { data: uptimeData = [], isLoading: uptimeDataLoading } =
    useRMSUptimeData(dateRange.from, dateRange.to);

  // Calculate performance metrics
  const {
    assetPerformanceData,
    averageMetricsData,
    systemReliabilityData,
    connectedAssets,
    activeAlerts,
  } = useMemo(() => {
    if (!assets.length || !uptimeData.length) {
      return {
        assetPerformanceData: [],
        averageMetricsData: [],
        systemReliabilityData: [],
        connectedAssets: { connected: 0, total: 0 },
        activeAlerts: 0,
      };
    }

    // Calculate total days in the period
    const startDate = dateRange.from;
    const endDate = dateRange.to;
    const totalDays =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    // Group uptime data by asset_detail_id
    const uptimeByAsset = uptimeData.reduce((acc, record) => {
      if (!acc[record.asset_detail_id]) {
        acc[record.asset_detail_id] = [];
      }
      acc[record.asset_detail_id].push(record);
      return acc;
    }, {} as Record<number, typeof uptimeData>);

    // Calculate metrics for each asset
    const assetMetrics: AssetPerformanceData[] = [];
    const systemMetrics = new Map<
      number,
      {
        name: string;
        assets: { availability: number; reliability: number }[];
      }
    >();

    Object.entries(uptimeByAsset).forEach(([assetDetailId, records]) => {
      const asset = assets.find(
        (a) => a.asset_detail_id === parseInt(assetDetailId)
      );
      if (!asset) return;

      // Calculate totals for this asset
      const totalUptime = records.reduce((sum, r) => sum + (r.uptime || 0), 0);
      const totalUnplannedShutdown = records.reduce(
        (sum, r) => sum + (r.unplanned_shutdown || 0),
        0
      );
      const totalPlannedShutdown = records.reduce(
        (sum, r) => sum + (r.planned_shutdown || 0),
        0
      );

      // Calculate standby for each record: 24 - (Uptime + USD + PSD)
      const totalStandby = records.reduce((sum, r) => {
        const standby =
          24 -
          ((r.uptime || 0) +
            (r.unplanned_shutdown || 0) +
            (r.planned_shutdown || 0));
        return sum + Math.max(0, standby);
      }, 0);

      const totalHoursInPeriod = totalDays * 24;

      // Apply RMS calculation formulas
      const utilization =
        totalHoursInPeriod > 0 ? (totalUptime / totalHoursInPeriod) * 100 : 0;

      const availability =
        totalHoursInPeriod > 0
          ? ((totalUptime + totalStandby) / totalHoursInPeriod) * 100
          : 0;

      const reliability =
        totalHoursInPeriod - totalPlannedShutdown > 0
          ? ((totalHoursInPeriod -
              totalUnplannedShutdown -
              totalPlannedShutdown) /
              (totalHoursInPeriod - totalPlannedShutdown)) *
            100
          : 0;

      const assetMetric: AssetPerformanceData = {
        name: asset.asset_name || asset.asset_no,
        utilization: Math.max(0, Math.min(100, utilization)),
        availability: Math.max(0, Math.min(100, availability)),
        reliability: Math.max(0, Math.min(100, reliability)),
        target: reliabilityTarget,
        systemId: asset.system_id,
        assetCount: 1,
      };

      assetMetrics.push(assetMetric);

      // Group by system for system-level calculations
      if (asset.system_id && asset.system?.system_name) {
        if (!systemMetrics.has(asset.system_id)) {
          systemMetrics.set(asset.system_id, {
            name: asset.system.system_name,
            assets: [],
          });
        }
        systemMetrics.get(asset.system_id)!.assets.push({
          availability: availability,
          reliability: reliability,
        });
      }
    });

    // Calculate system-level metrics
    const systemReliabilityData: SystemReliabilityData[] = Array.from(
      systemMetrics.entries()
    ).map(([systemId, data]) => {
      const assets = data.assets;
      const assetCount = assets.length;

      // Calculate system availability and reliability based on asset count
      let systemAvailability: number;
      let systemReliability: number;

      if (assetCount === 1) {
        systemAvailability = assets[0].availability;
        systemReliability = assets[0].reliability;
      } else {
        // For multiple assets: (1-((1-(Asset1/100))*(1-(Asset2/100))*...))*100
        const availabilityProduct = assets.reduce(
          (product, asset) => product * (1 - asset.availability / 100),
          1
        );
        systemAvailability = (1 - availabilityProduct) * 100;

        const reliabilityProduct = assets.reduce(
          (product, asset) => product * (1 - asset.reliability / 100),
          1
        );
        systemReliability = (1 - reliabilityProduct) * 100;
      }

      return {
        name: data.name,
        availability: Math.max(0, Math.min(100, systemAvailability)),
        reliability: Math.max(0, Math.min(100, systemReliability)),
      };
    });

    // Calculate average metrics
    const totalAssets = assetMetrics.length;
    const avgUtilization =
      totalAssets > 0
        ? assetMetrics.reduce((sum, asset) => sum + asset.utilization, 0) /
          totalAssets
        : 0;
    const avgAvailability =
      totalAssets > 0
        ? assetMetrics.reduce((sum, asset) => sum + asset.availability, 0) /
          totalAssets
        : 0;
    const avgReliability =
      totalAssets > 0
        ? assetMetrics.reduce((sum, asset) => sum + asset.reliability, 0) /
          totalAssets
        : 0;

    const averageMetricsData: AverageMetricsData[] = [
      {
        name: "Critical Assets",
        utilization: avgUtilization,
        availability: avgAvailability,
        reliability: avgReliability,
      },
    ];

    // Calculate connected assets and alerts
    const connectedAssets = {
      connected: assetsWithUptime.length,
      total: assets.length,
    };

    // Mock active alerts - you might want to implement a real alert system
    const activeAlerts = assetMetrics.filter(
      (asset) =>
        asset.availability < reliabilityTarget ||
        asset.reliability < reliabilityTarget
    ).length;

    return {
      assetPerformanceData: assetMetrics,
      averageMetricsData,
      systemReliabilityData,
      connectedAssets,
      activeAlerts,
    };
  }, [assets, uptimeData, dateRange, reliabilityTarget]);

  const isLoading = assetsLoading || uptimeAssetsLoading || uptimeDataLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="RMS Dashboard"
          subtitle="Real-time monitoring system overview"
          icon={<Database className="h-6 w-6" />}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="RMS Dashboard"
        subtitle="Real-time monitoring system overview"
        icon={<Database className="h-6 w-6" />}
      />

      <Breadcrumbs />

      <div className="space-y-4 mb-6">
        {/* Filter Type Selector */}
        <div className="flex items-center gap-4">
          <Label>Filter by:</Label>
          <div className="flex gap-2">
            <Button
              variant={filterType === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("year")}
            >
              Year
            </Button>
            <Button
              variant={filterType === "dateRange" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("dateRange")}
            >
              Date Range
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            {filterType === "year" ? (
              <>
                <Label htmlFor="year-select">Year:</Label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </>
            ) : (
              <>
                <DatePickerWithRange
                  dateRange={tempDateRange}
                  setDateRange={setTempDateRange}
                />
                <Button
                  onClick={applyDateRange}
                  disabled={!tempDateRange.from || !tempDateRange.to}
                >
                  Apply
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="reliability-target">Reliability Target (%):</Label>
            <Input
              id="reliability-target"
              type="number"
              min="0"
              max="100"
              value={reliabilityTarget}
              onChange={(e) => setReliabilityTarget(Number(e.target.value))}
              className="w-20"
            />
            <Button
              onClick={() => setReliabilityTarget(95)}
              variant="ghost"
              size="sm"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Current Filter Display */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Current filter: </span>
          {filterType === "year"
            ? `Year ${selectedYear}`
            : `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
                dateRange.to,
                "MMM dd, yyyy"
              )}`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Connected Assets"
          value={`${connectedAssets.connected}/${connectedAssets.total}`}
          icon={<Database className="h-6 w-6" />}
          changeLabel={`${
            connectedAssets.total - connectedAssets.connected
          } offline`}
        />
        <KpiCard
          title="Active Alerts"
          value={activeAlerts.toString()}
          icon={<AlertTriangle className="h-6 w-6" />}
          changeLabel="below target"
        />
        <KpiCard
          title="Avg Availability"
          value={`${averageMetricsData[0]?.availability.toFixed(1) || 0}%`}
          icon={<Activity className="h-6 w-6" />}
        />
        <KpiCard
          title="Avg Reliability"
          value={`${averageMetricsData[0]?.reliability.toFixed(1) || 0}%`}
          icon={<Gauge className="h-6 w-6" />}
        />
      </div>

      {/* Bar Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Utilization, Availability & Reliability Asset Wise */}
        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <CardTitle>
              Vital System Availability and Reliability Per Quarter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assetPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    label={{ value: "%", angle: -90, position: "insideLeft" }}
                    tickCount={11}
                    tickFormatter={(value) => `${value}`}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="utilization"
                    name="Utilization"
                    fill="#ff9800"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="availability"
                    name="Availability"
                    fill="#8bc34a"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="reliability"
                    name="Reliability"
                    fill="#03a9f4"
                    radius={[4, 4, 0, 0]}
                  />
                  <ReferenceLine
                    y={reliabilityTarget}
                    stroke="red"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    {assetPerformanceData.map((asset) => (
                      <TableHead key={asset.name}>{asset.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Availability</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-avail`}>
                        {asset.availability.toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reliability</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-rel`}>
                        {asset.reliability.toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Utilization</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-util`}>
                        {asset.utilization.toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* <TableRow>
                    <TableCell className="font-medium">Reliability Target (CC) %</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-target`}>{formatPercentage(asset.target)}</TableCell>
                    ))}
                  </TableRow> */}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Average Critical Asset Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Average Critical Asset Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={averageMetricsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="utilization"
                    name="Avg. Utilization"
                    fill="#8884d8"
                  />
                  <Bar
                    dataKey="availability"
                    name="Avg. Availability"
                    fill="#82ca9d"
                  />
                  <Bar
                    dataKey="reliability"
                    name="Avg. Reliability"
                    fill="#ffc658"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Average Utilization
                    </TableCell>
                    <TableCell>
                      {(averageMetricsData[0]?.utilization || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Average Availability
                    </TableCell>
                    <TableCell>
                      {(averageMetricsData[0]?.availability || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Average Reliability
                    </TableCell>
                    <TableCell>
                      {(averageMetricsData[0]?.reliability || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* System Reliability & Availability */}
        <Card>
          <CardHeader>
            <CardTitle>System Reliability & Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={systemReliabilityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    domain={[0, 100]}
                    label={{ value: "%", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="availability"
                    name="Availability"
                    fill="#82ca9d"
                  />
                  <Bar
                    dataKey="reliability"
                    name="Reliability"
                    fill="#ffc658"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    {systemReliabilityData.map((system) => (
                      <TableHead key={system.name}>{system.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Availability</TableCell>
                    {systemReliabilityData.map((system) => (
                      <TableCell key={`${system.name}-avail`}>
                        {system.availability.toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reliability</TableCell>
                    {systemReliabilityData.map((system) => (
                      <TableCell key={`${system.name}-rel`}>
                        {system.reliability.toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RMSDashboardPage;
