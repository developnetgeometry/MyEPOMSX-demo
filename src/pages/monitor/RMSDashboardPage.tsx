
import React, { useState } from 'react';
import { format } from 'date-fns';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  ReferenceLine
} from 'recharts';
import KpiCard from '@/components/shared/KpiCard';
import { Calendar, Database, Activity, AlertTriangle, Gauge } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { cn } from '@/lib/utils';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, subDays } from 'date-fns';
import { formatPercentage } from '@/utils/formatters';

// Sample data for utilization, availability & reliability asset wise
const assetPerformanceData = [
  {
    name: 'Diesel Engine Generator',
    utilization: 79.14,
    availability: 97.14,
    reliability: 97.56,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'Turbine Gen',
    utilization: 79.99,
    availability: 99.99,
    reliability: 99.99,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'Gas Comp',
    utilization: 86.68,
    availability: 99.68,
    reliability: 99.76,
    mttrAvailability: 99.94,
    mttrReliability: 99.94,
    target: 95
  },
  {
    name: 'Air Compressor',
    utilization: 90.00,
    availability: 100.00,
    reliability: 100.00,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'MOL Pump',
    utilization: 99.91,
    availability: 99.91,
    reliability: 99.76,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'Crane',
    utilization: 97.77,
    availability: 97.77,
    reliability: 98.54,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'SWIP',
    utilization: 100.00,
    availability: 100.00,
    reliability: 100.00,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'BWIP',
    utilization: 100.00,
    availability: 100.00,
    reliability: 100.00,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'Cooling Water Pump',
    utilization: 100.00,
    availability: 100.00,
    reliability: 100.00,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'Vacuum Pump',
    utilization: 100.00,
    availability: 100.00,
    reliability: 100.00,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  },
  {
    name: 'Water Injection to Well',
    utilization: 100.00,
    availability: 100.00,
    reliability: 100.00,
    mttrAvailability: 100.00,
    mttrReliability: 100.00,
    target: 95
  }
];

// Sample data for average metrics
const averageMetricsData = [
  {
    name: 'Critical Assets',
    utilization: 79,
    availability: 92,
    reliability: 86,
  },
];

// Sample data for system reliability & availability
const systemReliabilityData = [
  {
    name: 'System 1',
    availability: 94,
    reliability: 90,
  },
  {
    name: 'System 2',
    availability: 92,
    reliability: 87,
  },
  {
    name: 'System 3',
    availability: 96,
    reliability: 91,
  },
  {
    name: 'System 4',
    availability: 90,
    reliability: 84,
  },
];

// Fix the type error with the tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatPercentage(entry.value as number)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RMSDashboardPage = () => {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="RMS Dashboard" 
        subtitle="Real-time monitoring system overview"
        icon={<Database className="h-6 w-6" />}
      />
      
      <Breadcrumbs />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <DatePickerWithRange 
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard 
          title="Connected Assets" 
          value="24/26" 
          icon={<Database className="h-6 w-6" />} 
          changeLabel="2 offline"
        />
        <KpiCard 
          title="Active Alerts" 
          value="7" 
          icon={<AlertTriangle className="h-6 w-6" />} 
          change={2}
          changeDirection="down"
          positiveChange="down"
          changeLabel="vs yesterday"
        />
        <KpiCard 
          title="Data Transmission" 
          value="98.5%" 
          icon={<Activity className="h-6 w-6" />} 
          change={0.3}
          changeDirection="up"
          positiveChange="up"
          changeLabel="vs yesterday"
        />
        <KpiCard 
          title="System Health" 
          value="92%" 
          icon={<Gauge className="h-6 w-6" />} 
          change={1.5}
          changeDirection="up"
          positiveChange="up"
          changeLabel="vs last week"
        />
      </div>
      
      {/* Bar Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Utilization, Availability & Reliability Asset Wise */}
        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <CardTitle>Vital System Availability and Reliability Per Quarter</CardTitle>
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
                    tick={{fontSize: 12}}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    label={{ value: '%', angle: -90, position: 'insideLeft' }} 
                    tickCount={11}
                    tickFormatter={(value) => `${value}`}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="availability" name="Availability" fill="#8bc34a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mttrAvailability" name="MTTR Availability" fill="#4caf50" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reliability" name="Reliability" fill="#03a9f4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mttrReliability" name="MTTR Reliability" fill="#2196f3" radius={[4, 4, 0, 0]} />
                  <ReferenceLine y={95} stroke="red" strokeWidth={2} />
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
                    <TableCell className="font-medium">Availability %</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-avail`}>{formatPercentage(asset.availability)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MTTR Availability %</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-mttr-avail`}>{formatPercentage(asset.mttrAvailability)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reliability %</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-rel`}>{formatPercentage(asset.reliability)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MTTR Reliability %</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-mttr-rel`}>{formatPercentage(asset.mttrReliability)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reliability Target (CC) %</TableCell>
                    {assetPerformanceData.map((asset) => (
                      <TableCell key={`${asset.name}-target`}>{formatPercentage(asset.target)}</TableCell>
                    ))}
                  </TableRow>
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
                  <Bar dataKey="utilization" name="Avg. Utilization" fill="#8884d8" />
                  <Bar dataKey="availability" name="Avg. Availability" fill="#82ca9d" />
                  <Bar dataKey="reliability" name="Avg. Reliability" fill="#ffc658" />
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
                    <TableCell className="font-medium">Average Utilization</TableCell>
                    <TableCell>{formatPercentage(averageMetricsData[0].utilization)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Average Availability</TableCell>
                    <TableCell>{formatPercentage(averageMetricsData[0].availability)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Average Reliability</TableCell>
                    <TableCell>{formatPercentage(averageMetricsData[0].reliability)}</TableCell>
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
                  <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="availability" name="Availability" fill="#82ca9d" />
                  <Bar dataKey="reliability" name="Reliability" fill="#ffc658" />
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
                    <TableCell className="font-medium">Availability %</TableCell>
                    {systemReliabilityData.map((system) => (
                      <TableCell key={`${system.name}-avail`}>{formatPercentage(system.availability)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reliability %</TableCell>
                    {systemReliabilityData.map((system) => (
                      <TableCell key={`${system.name}-rel`}>{formatPercentage(system.reliability)}</TableCell>
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