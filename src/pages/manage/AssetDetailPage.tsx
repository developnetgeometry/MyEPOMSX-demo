import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Archive,
  FileText,
  Printer,
  Search,
  Plus,
  Settings,
  FileUp,
  File,
  Loader2,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAssetAttachments, useAssetWithRelations, useItemByBomId, useWorkOrdersByAssetId } from "@/hooks/queries/useAssets";
import { formatDate, getFileNameFromPath } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";


// Dummy data for Attachment Tab
const attachmentData = [
  {
    id: "1",
    type: "Certification",
    date: "2025-02-01",
    notes: "Calibration certificate",
    filename: "cert_2025.pdf",
  },
  {
    id: "2",
    type: "Drawing",
    date: "2024-11-15",
    notes: "P&ID Diagram",
    filename: "pid_v110_rev2.dwg",
  },
  {
    id: "3",
    type: "Workorder",
    date: "2025-01-20",
    notes: "Maintenance history documentation",
    filename: "maint_history_v110.pdf",
  },
];

// Dummy data for IoT Tab
const iotData = [
  {
    id: "1",
    sensorType: "Temperature Sensor",
    readingValue: "95°C",
    status: "Warning",
    lastSync: "2025-04-29 14:00",
  },
  {
    id: "2",
    sensorType: "Pressure Transmitter",
    readingValue: "12.5 bar",
    status: "Normal",
    lastSync: "2025-04-29 14:15",
  },
  {
    id: "3",
    sensorType: "Vibration Sensor",
    readingValue: "3.2 mm/s",
    status: "Critical",
    lastSync: "2025-04-29 13:55",
  },
  {
    id: "4",
    sensorType: "Flow Meter",
    readingValue: "250 L/min",
    status: "Normal",
    lastSync: "2025-04-29 14:10",
  },
  {
    id: "5",
    sensorType: "Level Sensor",
    readingValue: "78%",
    status: "Normal",
    lastSync: "2025-04-29 14:05",
  },
];

const AssetDetailPage: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Find the asset in sample data
  const [activeTab, setActiveTab] = useState("installation");

  const { data: asset, isLoading, error } = useAssetWithRelations(Number(id));

  const assetDetails = asset?.asset_detail;

  const bomID = assetDetails?.bom_id;
  
  const { data: bomData = [], isLoading: bomLoading } = useItemByBomId(bomID || 0);
  const { data: workOrder = [], isLoading: workOrderLoading } = useWorkOrdersByAssetId(Number(id));
  const { data: attachments = [] } = useAssetAttachments(Number(id));

  console.log("Attachments:", attachments);
  

  const childAssets = assetDetails?.child_assets;
  const assetInstallation = asset?.asset_installation;
  

  const commissionDate = asset?.commission_date ? formatDate(asset.commission_date) : "";

  const handleWorkRequest = () => {
    toast({
      title: "Success",
      description: "Adding work request",
      variant: "default",
    });
    navigate(`/maintain/work-request?assetId=${id}`);
  };
  const handleApplyChanges = () => {
    toast({
      title: "Success",
      description: "Applying changes",
      variant: "default",
    });
  };

  const handleAddInstallation = () => {
    toast({
      title: "Success",
      description: "Installation added successfully",
      variant: "default",
    })
  }

  const handleAddChildAsset = () => {
    toast({
      title: "Success",
      description: "Asset added successfully",
      variant: "default",
    })
  }

  const handleAddAttachment = () => {
    toast({
      title: "Success",
      description: "Attachment added successfully",
      variant: "default",
    })
  }

  const handleAddBom = () => {
    toast({
      title: "Success",
      description: "BOM added successfully",
      variant: "default",
    })
  }

  const handleAddIOT = () => {
    toast({
      title: "Success",
      description: "IOT added successfully",
      variant: "default",
    })
  }
  
  const handleAddWorkOrder = () => {
    toast({
      title: "Success",
      description: "Work Order added successfully",
      variant: "default",
    })
  }

  if (isLoading || bomLoading || workOrderLoading) {
    return <Loader2 />;
  }

  if (error) {
    return <div>Error loading asset: {error.message}</div>;
  }

  if (!asset) {
    return <div>Asset not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Asset: ${asset.asset_name || `#${id}`}`}
          icon={<Archive className="h-6 w-6" />}
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/manage/assets")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Assets
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <div>
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Facility Location</label>
                <Input value={asset?.facility.location_name} readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">System</label>
                <Input value={asset?.system.system_name} readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Package</label>
                <Input value={asset?.package.package_name} readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset No</label>
                <Input value={asset?.asset_no} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Name</label>
                <Input value={asset?.asset_name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Tag</label>
                <Select defaultValue={asset?.asset_tag.name}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TAG-1001">TAG-1001</SelectItem>
                    <SelectItem value="TAG-1002">TAG-1002</SelectItem>
                    <SelectItem value="TAG-1003">TAG-1003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Status</label>
                <Select defaultValue={asset?.asset_status.name}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Commissioning Date
                </label>
                <Input type="date" value={commissionDate} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Details Section with Blue Header */}
        <Card className="mb-4">
          <CardHeader className="bg-blue-500 text-white p-2">
            <CardTitle className="text-base">Asset Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <Input value={assetDetails.category.name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Type</label>
                <Input value={assetDetails.type.name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Manufacturer</label>
                <Input value={assetDetails.manufacturer.name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Maker No</label>
                <Input value={assetDetails.maker_no} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Model</label>
                <Input value={assetDetails.model} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Serial Number</label>
                <Input value={assetDetails.serial_number} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Class</label>
                <Input value={assetDetails.asset_class.name} />
              </div>

              {/* <div className="space-y-1.5">
                <label className="text-sm font-medium">Drawing No</label>
                <Input value={assetInstallation.drawing_no} />
              </div> */}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">HCode</label>
                <Input value={assetDetails.hs_code} />
              </div>

              {/* <div className="space-y-1.5">
                <label className="text-sm font-medium">Axis</label>
                <Input value={assetInstallation.orientation} />
              </div> */}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Specification</label>
                <Input value={assetDetails.specification} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sensor</label>
                <Select defaultValue={assetDetails.iot_sensor.sensor_type.name}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sensor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={assetDetails.iot_sensor.sensor_type.name}>{assetDetails.iot_sensor.sensor_type.name}</SelectItem>
                    <SelectItem value="TEMP-110">TEMP-110</SelectItem>
                    <SelectItem value="LVL-110">LVL-110</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">EC Class</label>
                <Input value={assetDetails.asset_class.name} />
              </div>

              {/* <div className="space-y-1.5">
                <label className="text-sm font-medium">EC Certificate</label>
                <Input value={assetInstallation.ex_certificate} />
              </div> */}

              <div className="col-span-2 grid grid-cols-2 gap-4 pt-2">
                {/* <div className="flex items-center space-x-2">
                  <Checkbox id="sce" checked={true} />
                  <label htmlFor="sce" className="text-sm font-medium">
                    SCE Code
                  </label>
                </div> */}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="criticality"
                    checked={true}
                  />
                  <label htmlFor="criticality" className="text-sm font-medium">
                    Criticality
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="active" checked={assetDetails.is_active} />
                  <label htmlFor="active" className="text-sm font-medium">
                    Active
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="integrity" checked={assetDetails.is_integrity} />
                  <label htmlFor="integrity" className="text-sm font-medium">
                    Integrity
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reliability"
                    checked={assetDetails.is_reliability}
                  />
                  <label htmlFor="reliability" className="text-sm font-medium">
                    Reliability
                  </label>
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Asset Image</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" /> Choose file
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    No file chosen
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={() => navigate("/manage/assets")}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleWorkRequest}>
                Work Request
              </Button>
              <Button onClick={handleApplyChanges}>Apply Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for V-110 Test Separator Details */}
        <Card>
          <CardHeader className="bg-blue-500 text-white p-2">
            <CardTitle className="text-base">
              {asset.asset_name} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="installation">Installation</TabsTrigger>
                <TabsTrigger value="childAsset">Child Asset</TabsTrigger>
                <TabsTrigger value="bom">BOM</TabsTrigger>
                <TabsTrigger value="workOrder">Work Order</TabsTrigger>
                <TabsTrigger value="attachment">Attachment</TabsTrigger>
                <TabsTrigger value="integrity">IoT</TabsTrigger>
              </TabsList>

              <TabsContent value="installation" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddInstallation}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Installation Type
                        </TableHead>
                        {/* <TableHead className="text-left p-3 font-medium">
                          Installed Location
                        </TableHead> */}
                        <TableHead className="text-left p-3 font-medium">
                          Installation Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Remarks
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {assetInstallation.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">
                            {item.intermittent_service}
                          </TableCell>
                          {/* <TableCell className="p-3">
                            {item.installedLocation}
                          </TableCell> */}
                          <TableCell className="p-3">
                            {formatDate(item.actual_installation_date)}
                          </TableCell>
                          <TableCell className="p-3">{item.description}</TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="childAsset" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddChildAsset}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Asset No</th>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Type</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {childAssets.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="p-3">{item.asset[0].asset_no}</td>
                          <td className="p-3">{item.asset[0].asset_name}</td>
                          <td className="p-3">{item.type.name}</td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="bom" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddBom}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Part No
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Part Name
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Quantity
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Unit of Measure
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Remarks
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {bomData?.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">{item.item_master.item_no}</TableCell>
                          <TableCell className="p-3">{item.item_master.item_name}</TableCell>
                          <TableCell className="p-3">{item.quantity}</TableCell>
                          <TableCell className="p-3">
                            {item.item_master.unit.name}
                          </TableCell>
                          <TableCell className="p-3">{item.description}</TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="workOrder" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddWorkOrder}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Work Order No
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Task
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          WO Status
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Due Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {workOrder?.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">
                            {item.work_order_no}
                          </TableCell>
                          <TableCell className="p-3">{item.task.task_name}</TableCell>
                          <TableCell className="p-3">
                            <StatusBadge status={item.status.name} />
                          </TableCell>
                          <TableCell className="p-3">{formatDate(item.due_date)}</TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="attachment" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddAttachment}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Type
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Attachment Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Notes
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Attachment
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {attachments.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">{item.type}</TableCell>
                          <TableCell className="p-3">{formatDate(item.created_at)}</TableCell>
                          <TableCell className="p-3">{item.notes}</TableCell>
                          <TableCell className="p-3">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4" />
                              <span>{getFileNameFromPath(item.file_path)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="integrity" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddIOT}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Sensor Type
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Reading Value
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Last Sync Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {iotData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">
                            {item.sensorType}
                          </TableCell>
                          <TableCell className="p-3">
                            {item.readingValue}
                          </TableCell>
                          <TableCell className="p-3">
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell className="p-3">{item.lastSync}</TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AssetDetailPage;
