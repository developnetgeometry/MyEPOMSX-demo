import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { HardDrive, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/utils/formatters';
import UptimeEntryModal from '@/components/monitor/UptimeEntryModal';
import { userWorkOrderDataByAsset } from '../work-orders/hooks/use-work-order-data';
import { useAsset } from '@/hooks/monitor/useAssets';

// Sample telemetry data generator (keep this until you have real telemetry)
const generateTelemetryData = (hours = 24, baseTemp = 85, basePressure = 12, baseVibration = 2.5, healthStatus = 'good') => {
  const multipliers: {[key: string]: number} = {
    'good': 1.0,
    'fair': 1.1,
    'poor': 1.3,
    'critical': 1.8,
  };
  
  const multiplier = multipliers[healthStatus.toLowerCase()] || 1;
  
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    const minute = time.getMinutes();
    
    const tempVariation = Math.sin(i / 3) * 5 * multiplier;
    const pressureVariation = Math.cos(i / 4) * 0.8 * multiplier;
    const vibrationVariation = Math.sin(i / 2) * 0.5 * multiplier;
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      temperature: parseFloat((baseTemp + tempVariation).toFixed(1)),
      pressure: parseFloat((basePressure + pressureVariation).toFixed(2)),
      vibration: parseFloat((baseVibration + vibrationVariation).toFixed(2))
    });
  }
  
  return data;
};

// Sample alerts data generator
const generateAlertData = (healthStatus = 'good') => {
  const baseAlerts = [
    { 
      id: '1',
      metric: 'Temperature',
      value: '92.5°C',
      threshold: '90.0°C',
      status: 'Warning',
      timestamp: '2025-05-12 08:45:22'
    },
    {
      id: '2',
      metric: 'Pressure',
      value: '13.8 MPa',
      threshold: '13.5 MPa',
      status: 'Warning',
      timestamp: '2025-05-12 09:30:15'
    }
  ];
  
  if (healthStatus.toLowerCase() === 'poor') {
    return [
      ...baseAlerts,
      {
        id: '3',
        metric: 'Temperature',
        value: '98.2°C',
        threshold: '95.0°C',
        status: 'Critical',
        timestamp: '2025-05-12 07:12:54'
      }
    ];
  } else if (healthStatus.toLowerCase() === 'critical') {
    return [
      ...baseAlerts,
      {
        id: '3',
        metric: 'Temperature',
        value: '110.5°C',
        threshold: '95.0°C',
        status: 'Critical',
        timestamp: '2025-05-12 07:12:54'
      },
      {
        id: '4',
        metric: 'Vibration',
        value: '5.8 mm/s',
        threshold: '4.0 mm/s',
        status: 'Critical',
        timestamp: '2025-05-12 11:03:27'
      }
    ];
  }
  
  return baseAlerts;
};

const RMSAssetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isUptimeModalOpen, setIsUptimeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [alertsData, setAlertsData] = useState<any[]>([]);

  // Use React Query hook to fetch asset data
  const {
    data: asset,
    isLoading,
    error
  } = useAsset(parseInt(id || '0'));

  const {
    data: workOrders = [],
    isLoading: workOrdersLoading,
    error: workOrdersError
  } = userWorkOrderDataByAsset(parseInt(id || '0'));

  // Generate sample telemetry and alert data when asset loads
  useEffect(() => {
    if (asset) {
      // You can calculate health status based on your business logic
      const healthStatus = 'good'; // This should come from your monitoring system
      setTelemetryData(generateTelemetryData(24, 85, 12, 2.5, healthStatus));
      setAlertsData(generateAlertData(healthStatus));
    }
  }, [asset]);

  const handleSaveUptimeData = (assetId: string, entries: any[]) => {
    console.log('Uptime data saved:', entries);
    // The useRMSUptime hook handles the actual saving
  };

  // Function to get status indicator component
  const getStatusIndicator = (status: string) => {
    const lowercaseStatus = status.toLowerCase();
    
    if (lowercaseStatus === 'good' || lowercaseStatus === 'excellent') {
      return (
        <div className="flex items-center">
          <Check className="h-4 w-4 text-green-500 mr-1.5" />
          <span className="text-green-700 font-medium">{status}</span>
        </div>
      );
    } else {
      return <StatusBadge status={status} />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Asset Details"
          subtitle="Loading..."
          icon={<HardDrive className="h-6 w-6" />}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading asset details...</div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Asset Not Found"
          subtitle="The requested asset could not be found"
          icon={<HardDrive className="h-6 w-6" />}
        />
        <div className="flex justify-center items-center h-64">
          <Button onClick={() => navigate('/monitor/rms-asset-list')}>
            Back to Asset List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Asset: ${asset.asset_name}`}
        subtitle={asset.asset_no}
        icon={<HardDrive className="h-6 w-6" />}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* <TabsList className="grid w-full md:w-[500px] grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="telemetry">Live Telemetry</TabsTrigger>
          <TabsTrigger value="health">Health Status</TabsTrigger>
          <TabsTrigger value="alerts">Alert Analysis</TabsTrigger>
        </TabsList> */}
        
        <TabsContent value="basic" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Basic Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-8 gap-1"
                  onClick={() => setIsUptimeModalOpen(true)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Uptime Entry</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Asset No</h3>
                    <p>{asset.asset_no}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Asset Name</h3>
                    <p>{asset.asset_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Package</h3>
                    <p>{asset.package?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">System</h3>
                    <p>{asset.system?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Facility</h3>
                    <p>{asset.facility?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Asset Tag</h3>
                    <p>{asset.asset_tag?.tag_name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Model</h3>
                    <p>{asset.asset_detail?.model || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p>{asset.status?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">SCE Code</h3>
                    <p>{asset.asset_sce?.sce_code || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Criticality Code</h3>
                    <p>{asset.asset_sce?.criticality_code || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Commission Date</h3>
                    <p>{asset.commission_date ? formatDateTime(asset.commission_date) : 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Health Status</h3>
                    <StatusBadge status="Good" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Specification</h3>
                  <p className="mt-1">{asset.asset_detail?.specification || 'No specification available'}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
                    <p>{asset.asset_detail?.manufacturer?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p>{asset.asset_detail?.category?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p>{asset.asset_detail?.type?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
                    <p>{asset.asset_detail?.serial_number || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Asset Detail ID</h3>
                    <p>{asset.asset_detail_id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                    <p>{formatDateTime(asset.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-3">
              <CardHeader>
                <CardTitle>Work Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Order No</TableHead>
                      <TableHead>Work Order Date</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Downtime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrdersLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className='text-center py-6'>
                          Loading work orders...
                        </TableCell>
                      </TableRow>
                    ) : workOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className='text-center py-6'>
                          No work orders found for this asset
                        </TableCell>
                      </TableRow>
                    ) : (
                      workOrders.map((workOrder) => (
                        <TableRow key={workOrder.id}>
                          <TableCell>{workOrder.work_order_no || 'N/A'}</TableCell>
                          <TableCell>{formatDateTime(workOrder.created_at)}</TableCell>
                          <TableCell>{workOrder.description || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className={
                              workOrder.work_order_type?.id === 1 ? 'bg-red-500' : ' bg-blue-500'
                            }>
                              {workOrder.work_order_type?.id === 1 ? 'CM' :
                                workOrder.work_order_type?.id === 2 ? 'PM' : 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {workOrder.cm_work_order_id?.downtime ? `${workOrder.cm_work_order_id.downtime}` : 'N/A' }
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="telemetry" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['auto', 'auto']} label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" name="Temperature" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pressure Readings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={telemetryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={['auto', 'auto']} label={{ value: 'MPa', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="pressure" name="Pressure" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vibration Readings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={telemetryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={['auto', 'auto']} label={{ value: 'mm/s', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="vibration" name="Vibration" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="mt-6">
          <div className="space-y-6">
            <Card className="border-green-100 bg-green-50/30">
              <CardContent className="p-6 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="text-lg font-medium text-gray-700">Overall Health Status</h3>
                  <div className="flex items-center">
                    <div className="rounded-full w-4 h-4 mr-3 bg-green-500"></div>
                    <span className="text-3xl font-bold">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Health Status Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 border-b border-gray-100">
                    <span className="font-medium">Temperature Status</span>
                    <div>{getStatusIndicator("Good")}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 border-b border-gray-100">
                    <span className="font-medium">Pressure Status</span>
                    <div>{getStatusIndicator("Good")}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 border-b border-gray-100">
                    <span className="font-medium">Vibration Status</span>
                    <div>{getStatusIndicator("Good")}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 border-b border-gray-100">
                    <span className="font-medium">Overall Performance</span>
                    <div>{getStatusIndicator("Good")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No alerts found for this asset
                      </TableCell>
                    </TableRow>
                  ) : (
                    alertsData.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.metric}</TableCell>
                        <TableCell>
                          <span className={
                            alert.status === 'Critical' ? 'text-red-500 font-semibold' : 
                            alert.status === 'Warning' ? 'text-orange-500 font-semibold' : ''
                          }>
                            {alert.value}
                          </span>
                        </TableCell>
                        <TableCell>{alert.threshold}</TableCell>
                        <TableCell>
                          <Badge className={
                            alert.status === 'Critical' ? 'bg-red-500' :
                            alert.status === 'Warning' ? 'bg-orange-500' :
                            'bg-green-500'
                          }>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(alert.timestamp)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <UptimeEntryModal
        open={isUptimeModalOpen}
        onOpenChange={setIsUptimeModalOpen}
        assetId={asset.id.toString()}
        assetDetailId={asset.asset_detail_id}
        assetName={asset.asset_name}
        onSave={handleSaveUptimeData}
      />
    </div>
  );
};

export default RMSAssetDetailPage;