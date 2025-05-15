
import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KpiCard from '@/components/shared/KpiCard';
import { Database, Activity, AlertTriangle, Gauge, ShieldAlert, Clock, FileCheck, Calendar } from 'lucide-react';
import RiskMatrix from '@/components/monitor/RiskMatrix';
import { Progress } from '@/components/ui/progress';

// Sample data for inspection completion by type
const inspectionCompletionData = [
  { type: 'Visual', completed: 92, total: 100 },
  { type: 'UT Thickness', completed: 85, total: 100 },
  { type: 'MPI', completed: 78, total: 100 },
  { type: 'Radiography', completed: 65, total: 100 },
  { type: 'PAUT', completed: 88, total: 100 },
];

// Sample data for integrity metrics
const integrityMetricsData = [
  { name: 'Pressure Vessels', value: 93 },
  { name: 'Piping', value: 87 },
  { name: 'Tanks', value: 82 },
  { name: 'Heat Exchangers', value: 91 },
  { name: 'Rotating Equipment', value: 78 },
];

const IMSDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="IMS Dashboard" 
        subtitle="Integrity Management System Overview"
        icon={<ShieldAlert className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Total Assets" 
          value="124" 
          icon={<Database className="h-6 w-6" />} 
          changeLabel="12 critical"
        />
        <KpiCard 
          title="High Risk Items" 
          value="15" 
          icon={<AlertTriangle className="h-6 w-6" />} 
          change={3}
          changeDirection="down"
          positiveChange="down"
          changeLabel="vs last month"
        />
        <KpiCard 
          title="Inspection Compliance" 
          value="92.5%" 
          icon={<Activity className="h-6 w-6" />} 
          change={1.5}
          changeDirection="up"
          positiveChange="up"
          changeLabel="vs last month"
        />
        <KpiCard 
          title="Overall Integrity" 
          value="87%" 
          icon={<Gauge className="h-6 w-6" />} 
          change={2.3}
          changeDirection="up"
          positiveChange="up"
          changeLabel="vs last quarter"
        />
      </div>

      <Tabs defaultValue="risk" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="risk">Risk Matrix</TabsTrigger>
          <TabsTrigger value="integrity">Integrity Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="risk" className="mt-6">
          {/* Resize the risk matrix by wrapping it in a container with max-width and mx-auto */}
          <div className="max-w-3xl mx-auto">
            <RiskMatrix />
          </div>
        </TabsContent>
        
        <TabsContent value="integrity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-purple-500" />
                  Inspection Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspectionCompletionData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.completed}%</span>
                      </div>
                      <Progress value={item.completed} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <div className="flex items-center text-blue-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Next inspections scheduled: 14</span>
                  </div>
                  <div className="flex items-center mt-2 text-blue-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Due within 30 days: 8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-purple-500" />
                  Integrity Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrityMetricsData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.value >= 90 ? 'bg-green-500' : 
                            item.value >= 80 ? 'bg-blue-500' : 
                            item.value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-md text-center">
                    <div className="text-green-600 text-sm font-medium">Completed</div>
                    <div className="text-green-700 text-2xl font-bold">156</div>
                    <div className="text-green-600 text-xs">inspections</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-md text-center">
                    <div className="text-red-600 text-sm font-medium">Overdue</div>
                    <div className="text-red-700 text-2xl font-bold">7</div>
                    <div className="text-red-600 text-xs">inspections</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IMSDashboardPage;
