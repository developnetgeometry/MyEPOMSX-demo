import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import KpiCard from "@/components/shared/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  AlertCircle,
  Clock,
  Wrench,
  CheckCircle2,
  BarChart4,
  Calendar,
  Gauge,
  ShoppingCart,
  CalendarIcon,
} from "lucide-react";
import {
  useAssetsCount,
  useCurrentMonthAssets,
  usePreviousMonthAssets,
  useCurrentMonthWorkOrders,
  usePreviousMonthWorkOrders,
  useScheduledMaintenanceCount,
  useUpcomingMaintenance,
  useWorkOrderStatusDistribution,
  useMaintenanceActivityByType,
  useCriticalAlerts,
  useActiveItemsCount,
  useItemsCreatedByMonth,
  useOpenWorkOrdersCount,
} from "@/hooks/queries/useDashboard";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-picker";

// Sample data for charts (fallbacks while loading)
const barChartData = [
  { name: "Jan", preventive: 65, corrective: 40 },
  { name: "Feb", preventive: 59, corrective: 45 },
  { name: "Mar", preventive: 80, corrective: 37 },
  { name: "Apr", preventive: 81, corrective: 26 },
  { name: "May", preventive: 56, corrective: 38 },
  { name: "Jun", preventive: 55, corrective: 43 },
  { name: "Jul", preventive: 67, corrective: 30 },
];

const pieChartData = [
  { name: "Completed", value: 540, color: "#4caf50" },
  { name: "In Progress", value: 210, color: "#2196f3" },
  { name: "Pending", value: 150, color: "#ff9800" },
  { name: "Overdue", value: 90, color: "#f44336" },
];

const areaChartData = [
  { date: "2023-01-01", value: 34 },
  { date: "2023-02-01", value: 45 },
  { date: "2023-03-01", value: 31 },
  { date: "2023-04-01", value: 65 },
  { date: "2023-05-01", value: 49 },
  { date: "2023-06-01", value: 62 },
  { date: "2023-07-01", value: 91 },
  { date: "2023-08-01", value: 84 },
];

const Overview: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(),
  });

  // Asset counts
  const { data: assetsCount } = useAssetsCount();
  const { data: currentMonthAssets } = useCurrentMonthAssets();
  const { data: previousMonthAssets } = usePreviousMonthAssets();
  const { data: activeItemsCount } = useActiveItemsCount();
  const { data: itemsByMonth } = useItemsCreatedByMonth();

  // Work order counts
  const { data: currentMonthWorkOrders } = useCurrentMonthWorkOrders();
  const { data: previousMonthWorkOrders } = usePreviousMonthWorkOrders();
  const { data: openWorkOrdersCount } = useOpenWorkOrdersCount();

  // Maintenance data
  const { data: scheduledMaintenanceCount } = useScheduledMaintenanceCount();
  const { data: upcomingMaintenance } = useUpcomingMaintenance();

  // Chart data
  const { data: workOrderStatusData } =
    useWorkOrderStatusDistribution(dateRange);
  const { data: maintenanceActivityData } =
    useMaintenanceActivityByType(dateRange);

  // Critical alerts data
  const { data: criticalAlertsData } = useCriticalAlerts();

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const assetChange =
    previousMonthAssets !== undefined && currentMonthAssets !== undefined
      ? calculateChange(currentMonthAssets, previousMonthAssets)
      : 0;

  const workOrderChange =
    previousMonthWorkOrders !== undefined &&
    currentMonthWorkOrders !== undefined
      ? calculateChange(currentMonthWorkOrders, previousMonthWorkOrders)
      : 0;

  const itemsChange = itemsByMonth
    ? calculateChange(itemsByMonth.currentMonth, itemsByMonth.previousMonth)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Dashboard Overview" />

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border rounded-md px-3 py-1">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">
              {dateRange.startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              -{" "}
              {dateRange.endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const today = new Date();
              setDateRange({
                startDate: new Date(today.getFullYear(), today.getMonth(), 1),
                endDate: today,
              });
            }}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const today = new Date();
              setDateRange({
                startDate: new Date(
                  today.getFullYear(),
                  today.getMonth() - 1,
                  1
                ),
                endDate: new Date(today.getFullYear(), today.getMonth(), 0),
              });
            }}
          >
            Last Month
          </Button>
          <DateRangePicker
            onSelect={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Assets"
          value={assetsCount?.toString() || "0"}
          icon={<BarChart4 size={24} />}
          change={Number(assetChange.toFixed(1))}
          changeLabel="vs last month"
          changeDirection={assetChange >= 0 ? "up" : "down"}
        />
        <KpiCard
          title="Open Work Orders"
          value={openWorkOrdersCount?.toString() || "0"}
          icon={<Wrench size={24} />}
          change={Number(workOrderChange.toFixed(1))}
          changeLabel="vs last month"
          changeDirection={workOrderChange >= 0 ? "up" : "down"}
          positiveChange="down"
        />
        <KpiCard
          title="Scheduled Maintenance"
          value={scheduledMaintenanceCount?.toString() || "0"}
          icon={<Calendar size={24} />}
          change={upcomingMaintenance?.length || 0}
          changeLabel="upcoming this week"
          changeDirection="up"
        />
        <KpiCard
          title="Total Items"
          value={activeItemsCount?.toString() || "0"}
          icon={<ShoppingCart size={24} />}
          change={Number(itemsChange.toFixed(1))}
          changeLabel="new items vs last month"
          changeDirection={itemsChange >= 0 ? "up" : "down"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Maintenance Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue="workOrders">
              <TabsList>
                <TabsTrigger value="workOrders">Work Orders</TabsTrigger>
                <TabsTrigger value="openCloseStatus">
                  Open/Close Status
                </TabsTrigger>
              </TabsList>
              <TabsContent value="workOrders" className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maintenanceActivityData || barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="preventive"
                        name="Preventive"
                        fill="#1976d2"
                      />
                      <Bar
                        dataKey="corrective"
                        name="Corrective"
                        fill="#ff9800"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="openCloseStatus" className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={workOrderStatusData || []}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={150}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} work orders`, "Count"]}
                        labelFormatter={(label) => `Status: ${label}`}
                      />
                      <Legend
                        payload={
                          workOrderStatusData?.map((entry, index) => ({
                            id: entry.name,
                            type: "square",
                            value: entry.name,
                            color: entry.color,
                          })) || []
                        }
                      />
                      <Bar dataKey="value" name="Work Orders">
                        {(workOrderStatusData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Work Order Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 flex flex-col">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workOrderStatusData || pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {(workOrderStatusData || pieChartData).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} work orders`, "Count"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {(workOrderStatusData || pieChartData).map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Critical Alerts</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {criticalAlertsData?.length ? (
              <ul className="space-y-4">
                {criticalAlertsData.map((alert) => (
                  <li
                    key={alert.id}
                    className={`flex items-center space-x-3 p-3 rounded-md ${
                      alert.riskLevel === "HighRisk"
                        ? "bg-red-50 border-l-4 border-red-500"
                        : "bg-amber-50 border-l-4 border-amber-400"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        alert.riskLevel === "HighRisk"
                          ? "bg-red-500"
                          : "bg-amber-400"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">
                        {alert.riskLevel === "HighRisk"
                          ? "High Risk Work Order"
                          : "Near Due Work Order"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {alert.asset} • Priority: {alert.priority} • Due:{" "}
                        {alert.dueDate
                          ? new Date(alert.dueDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No critical alerts
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Upcoming Maintenance</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMaintenance?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase text-gray-500 border-b">
                    <tr>
                      <th className="px-4 py-3">PM No</th>
                      <th className="px-4 py-3">Next Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingMaintenance.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {item.pmNumber}
                        </td>
                        <td className="px-4 py-3">
                          {item.date
                            ? new Date(item.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">{item.description}</td>
                        <td className="px-4 py-3">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "Scheduled"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.status}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.priority === "High" ||
                              item.priority === "Critical"
                                ? "bg-red-100 text-red-800"
                                : item.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.priority}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming maintenance scheduled
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
