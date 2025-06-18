import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Settings, File } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, getFileNameFromPath } from "@/utils/formatters";

const AssetTabs = ({
  activeTab,
  setActiveTab,
  assetInstallation,
  handleAddInstallation,
  handleViewInstallation,
  handleEditInstallation,
  handleDeleteInstallation,
  childAssets,
  handleAddChildAsset,
  handleViewChildAsset,
  handleEditChildAsset,
  handleDeleteChildAsset,
  bomData,
  handleAddBom,
  handleViewBom,
  handleEditBom,
  handleRemoveBom,
  workOrder,
  handleAddWorkOrder,
  attachments,
  handleAddAttachment,
  iotData,
  handleAddIOT,
}) => (
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    <TabsList className="w-full justify-start">
      <TabsTrigger value="installation">Installation</TabsTrigger>
      <TabsTrigger value="childAsset">Child Asset</TabsTrigger>
      <TabsTrigger value="bom">BOM</TabsTrigger>
      <TabsTrigger value="workOrder">Work Order</TabsTrigger>
      <TabsTrigger value="attachment">Attachment</TabsTrigger>
      {/* <TabsTrigger value="integrity">IoT</TabsTrigger> */}
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
          {!assetInstallation || assetInstallation.length === 0 ? (
            <Button
              size="icon"
              className="ml-2"
              onClick={handleAddInstallation}
            >
              <Plus className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-left p-3 font-medium">
                Installation Date
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Startup Date
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Service Type
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                EX Certificate
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Drawing No
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {assetInstallation && assetInstallation.length > 0 ? (
              assetInstallation.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="p-3">
                    {item.actual_installation_date
                      ? formatDate(item.actual_installation_date)
                      : "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    {item.actual_startup_date
                      ? formatDate(item.actual_startup_date)
                      : "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    {item.intermittent_service || "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    {item.ex_certificate || "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    {item.drawing_no || "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInstallation(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditInstallation(item)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInstallation(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  No installation records found. Click the + button to add a new
                  installation.
                </TableCell>
              </TableRow>
            )}
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-left p-3 font-medium">Code</TableHead>
              <TableHead className="text-left p-3 font-medium">Type</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Category
              </TableHead>
              <TableHead className="text-left p-3 font-medium">Name</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Description
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Status
              </TableHead>
              <TableHead className="text-left p-3 font-medium">Class</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Serial Number
              </TableHead>
              <TableHead className="text-left p-3 font-medium">TAG</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {childAssets && childAssets.length > 0 ? (
              childAssets.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="p-3">
                    {item && item?.asset_no}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item?.asset_detail?.type?.name}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item.asset_detail?.category?.name}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item.asset_name}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item.asset_detail?.specification}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item.status?.name}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item.asset_detail?.asset_class?.name}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item.asset_detail?.serial_number}
                  </TableCell>
                  <TableCell className="p-3">
                    {item && item.asset_tag?.name}
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewChildAsset(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditChildAsset(item)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteChildAsset(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="p-8 text-center text-muted-foreground"
                >
                  No child assets found. Click the + button to add a new child
                  asset.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                BOM Assembly
              </TableHead>
              <TableHead className="text-left p-3 font-medium">Code</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Spare Parts
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {bomData && bomData.length > 0 ? (
              bomData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="p-3">
                    {(item.bom.bom_name) || "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    {item.bom.bom_code || "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    {item.item_master?.item_name || "-"}
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBom(item.bom_id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBom(item.bom_id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBom(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-8 text-center text-muted-foreground"
                >
                  No BOM records found. Click the + button to add a new BOM.
                </TableCell>
              </TableRow>
            )}
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
                Work Order Date
              </TableHead>
              <TableHead className="text-left p-3 font-medium">Note</TableHead>
              <TableHead className="text-left p-3 font-medium">Type</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Finished On
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Assigned To
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Status
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {workOrder && workOrder.length > 0 ? (
              workOrder.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="p-3">{item.work_order_no}</TableCell>
                  <TableCell className="p-3">
                    {item.task?.task_name || "N/A"}
                  </TableCell>
                  <TableCell className="p-3">
                    <StatusBadge status={item.status?.name || "Unknown"} />
                  </TableCell>
                  <TableCell className="p-3">
                    {formatDate(item.due_date)}
                  </TableCell>
                  <TableCell className="p-3">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="p-8 text-center text-muted-foreground"
                >
                  No work orders found. Click the + button to add a new work
                  order.
                </TableCell>
              </TableRow>
            )}
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
              <TableHead className="text-left p-3 font-medium">Type</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Attachment Date
              </TableHead>
              <TableHead className="text-left p-3 font-medium">Notes</TableHead>
              <TableHead className="text-left p-3 font-medium">
                Attachment
              </TableHead>
              <TableHead className="text-left p-3 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {attachments && attachments.length > 0 ? (
              attachments.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="p-3">{item.type}</TableCell>
                  <TableCell className="p-3">
                    {formatDate(item.created_at)}
                  </TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No attachments found. Click the + button to add a new
                  attachment.
                </TableCell>
              </TableRow>
            )}
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
                <TableCell className="p-3">{item.sensorType}</TableCell>
                <TableCell className="p-3">{item.readingValue}</TableCell>
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
);

export default AssetTabs;
