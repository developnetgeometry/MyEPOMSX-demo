
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  FileText, 
  List, 
  Calendar, 
  Activity, 
  Link, 
  BarChart3, 
  Clock, 
  File, 
  CheckSquare, 
  ClipboardCheck, 
  Info, 
  Users,
  Pencil,
  Upload,
  Paperclip
} from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const WorkOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [files, setFiles] = useState<File[]>([]);
  
  // This would typically come from an API call based on the ID
  const workOrderData = {
    workOrderNo: `WO-CPP-PM-24/000${id}`,
    status: "Defer",
    task: "T001 - Task Name 1",
    description: "PM Test 14/40/2024 Latest",
    assetNo: `ASSET-${id}`,
    workType: "Preventive Maintenance",
    workCenter: "Mechanical"
  };

  // Sample task list data
  const taskListData = [
    { seq: 1, taskDescription: "Replace light bulb" },
    { seq: 2, taskDescription: "Tighten bolt" },
    { seq: 3, taskDescription: "Lubricate motor" },
    { seq: 4, taskDescription: "Check electrical connections" },
    { seq: 5, taskDescription: "Clean filters" },
    { seq: 6, taskDescription: "Test operation" },
    { seq: 7, taskDescription: "Inspect for leaks" },
    { seq: 8, taskDescription: "Verify temperature readings" },
    { seq: 9, taskDescription: "Replace gaskets" },
    { seq: 10, taskDescription: "Document findings" }
  ];

  // Sample plan labor data
  const planLaborData = [
    { employee: "Muhammad Izzat Imran", duration: 2, manPower: 1 },
    { employee: "Zary Juary", duration: 2, manPower: 1 }
  ];

  // Sample plan material data
  const planMaterialData = [
    { material: "CLAS2-Vending Machine", quantity: 1 }
  ];

  // Sample actual labor data
  const actualLaborData = [
    { employee: "Muhammad Izzat Imran", duration: 6, manPower: 2 }
  ];

  // Sample actual material data
  const actualMaterialData = [
    { material: "14872 - Screwdriver", quantity: 1 }
  ];

  // Sample related WO data
  const relatedWOData = [
    { workOrderNo: "WO-CPP-PM-24/0001001", asset: "Heat Exchanger", planDueDate: "15/06/2024", status: "Execute" },
    { workOrderNo: "WO-CPP-PM-24/0001002", asset: "Pump P-101", planDueDate: "18/06/2024", status: "Planning" },
    { workOrderNo: "WO-CPP-PM-24/0001003", asset: "Motor M-201", planDueDate: "22/06/2024", status: "Open" },
    { workOrderNo: "WO-CPP-PM-24/0001004", asset: "Compressor C-301", planDueDate: "25/06/2024", status: "In Progress" },
    { workOrderNo: "WO-CPP-PM-24/0001005", asset: "Valve V-401", planDueDate: "28/06/2024", status: "Closed" }
  ];

  // Sample defer data
  const deferData = {
    newDueDate: "19/10/2024",
    previousDueDate: "13/10/2024",
    requestedBy: "Muhammad Izzat Imran",
    remarks: "Adjusted schedule due to inspection"
  };

  // Sample attachment data
  const attachmentData = [
    { type: "Work Order", attachmentDate: "12/09/2024", notes: "Document reference", attachmentFile: "work_order_doc.pdf" }
  ];

  // Sample minimum acceptance criteria data
  const minAcceptanceData = [
    { criteria: "Temperature", minValue: "20°C", maxValue: "25°C", actualValue: "22°C", status: "Pass" },
    { criteria: "Pressure", minValue: "2.5 bar", maxValue: "3.0 bar", actualValue: "2.7 bar", status: "Pass" },
    { criteria: "Vibration", minValue: "0", maxValue: "2.5 mm/s", actualValue: "1.8 mm/s", status: "Pass" }
  ];

  // Sample checksheet data
  const checksheetData = [
    { item: "Safety equipment check", completed: true, remarks: "All safety equipment in order" },
    { item: "Tools inspection", completed: true, remarks: "No damaged tools" },
    { item: "Area preparation", completed: true, remarks: "Work area properly cordoned" },
    { item: "Post-maintenance cleanup", completed: false, remarks: "Pending completion" }
  ];

  // Sample maintainable group data
  const maintainableGroupData = [
    { groupCode: "MECH-001", groupName: "Mechanical Group A", members: "James, Robert, John" },
    { groupCode: "ELEC-001", groupName: "Electrical Group B", members: "Michael, David, William" }
  ];

  // Form for Reports tab
  const reportFormSchema = z.object({
    equipmentStatus: z.string().min(1, "Equipment status is required"),
    sceResult: z.string().min(1, "SCE result is required"),
    detailDescription: z.string().min(1, "Detail description is required"),
    cleaning: z.boolean().optional(),
    overhaul: z.boolean().optional(),
    tightenBolt: z.boolean().optional(),
    lubrication: z.boolean().optional()
  });

  const reportForm = useForm({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      equipmentStatus: "",
      sceResult: "",
      detailDescription: "",
      cleaning: false,
      overhaul: false,
      tightenBolt: false,
      lubrication: false
    }
  });

  const onReportSubmit = (values: any) => {
    console.log(values);
    toast.success("Report submitted successfully");
  };

  // Form for attachment upload
  const attachmentFormSchema = z.object({
    description: z.string().min(1, "Description is required")
  });

  const attachmentForm = useForm({
    resolver: zodResolver(attachmentFormSchema),
    defaultValues: {
      description: ""
    }
  });

  const onAttachmentSubmit = (values: any) => {
    if (files.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    console.log({
      files,
      ...values
    });
    toast.success("File uploaded successfully");
    attachmentForm.reset();
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Work Order Detail" 
        />
        <Button variant="outline" onClick={() => navigate('/maintain/work-order-list')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Work Orders
        </Button>
      </div>
      
      {/* Work Order Header Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold">{workOrderData.workOrderNo}</CardTitle>
            <StatusBadge status={workOrderData.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Task</h3>
                <p className="text-base">{workOrderData.task}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Asset No</h3>
                <p className="text-base">{workOrderData.assetNo}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Work Type</h3>
                <p className="text-base">{workOrderData.workType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Work Center</h3>
                <p className="text-base">{workOrderData.workCenter}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <Card className="bg-gray-50">
                <CardContent className="pt-4">
                  <p className="text-gray-700">{workOrderData.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs Section */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollArea className="w-full border-b">
              <div className="flex p-1">
                <TabsList className="inline-flex h-10 items-center justify-start bg-transparent p-0 w-max">
                  <TabsTrigger value="general" className="flex gap-2 items-center">
                    <FileText className="h-4 w-4" /> General
                  </TabsTrigger>
                  <TabsTrigger value="task-detail" className="flex gap-2 items-center">
                    <List className="h-4 w-4" /> Task Detail
                  </TabsTrigger>
                  <TabsTrigger value="plan" className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4" /> Plan
                  </TabsTrigger>
                  <TabsTrigger value="actual" className="flex gap-2 items-center">
                    <Activity className="h-4 w-4" /> Actual
                  </TabsTrigger>
                  <TabsTrigger value="related-wo" className="flex gap-2 items-center">
                    <Link className="h-4 w-4" /> Related WO
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="flex gap-2 items-center">
                    <BarChart3 className="h-4 w-4" /> Reports
                  </TabsTrigger>
                  <TabsTrigger value="defer" className="flex gap-2 items-center">
                    <Clock className="h-4 w-4" /> Defer
                  </TabsTrigger>
                  <TabsTrigger value="attachment" className="flex gap-2 items-center">
                    <File className="h-4 w-4" /> Attachment
                  </TabsTrigger>
                  <TabsTrigger value="min-acceptance-criteria" className="flex gap-2 items-center">
                    <CheckSquare className="h-4 w-4" /> Min Acceptance Criteria
                  </TabsTrigger>
                  <TabsTrigger value="checksheet" className="flex gap-2 items-center">
                    <ClipboardCheck className="h-4 w-4" /> Checksheet
                  </TabsTrigger>
                  <TabsTrigger value="additional-info" className="flex gap-2 items-center">
                    <Info className="h-4 w-4" /> Additional Info
                  </TabsTrigger>
                  <TabsTrigger value="maintainable-group" className="flex gap-2 items-center">
                    <Users className="h-4 w-4" /> Maintainable Group
                  </TabsTrigger>
                </TabsList>
              </div>
            </ScrollArea>
            
            {/* Tab Contents */}
            <TabsContent value="general" className="p-6">
              <h3 className="text-lg font-medium mb-4">General Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created Date</h4>
                    <p className="text-base">01/06/2024</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                    <p className="text-base">System Administrator</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Priority</h4>
                    <p className="text-base">Medium</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Plan Start Date</h4>
                    <p className="text-base">10/06/2024</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Plan End Date</h4>
                    <p className="text-base">12/06/2024</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Assigned To</h4>
                    <p className="text-base">Maintenance Team A</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="task-detail" className="p-6">
              <h3 className="text-lg font-medium mb-4">Task Details</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Seq</TableHead>
                        <TableHead>Task List</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskListData.map((task) => (
                        <TableRow key={task.seq}>
                          <TableCell className="font-medium">{task.seq}</TableCell>
                          <TableCell>{task.taskDescription}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="plan" className="p-6">
              <h3 className="text-lg font-medium mb-4">Planning Information</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">Plan Labor</h4>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Man Power</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {planLaborData.map((labor, index) => (
                            <TableRow key={index}>
                              <TableCell>{labor.employee}</TableCell>
                              <TableCell>{labor.duration}</TableCell>
                              <TableCell>{labor.manPower}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Plan Material</h4>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {planMaterialData.map((material, index) => (
                            <TableRow key={index}>
                              <TableCell>{material.material}</TableCell>
                              <TableCell>{material.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actual" className="p-6">
              <h3 className="text-lg font-medium mb-4">Actual Execution</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">Actual Labor</h4>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Man Power</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {actualLaborData.map((labor, index) => (
                            <TableRow key={index}>
                              <TableCell>{labor.employee}</TableCell>
                              <TableCell>{labor.duration}</TableCell>
                              <TableCell>{labor.manPower}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Actual Material</h4>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {actualMaterialData.map((material, index) => (
                            <TableRow key={index}>
                              <TableCell>{material.material}</TableCell>
                              <TableCell>{material.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="related-wo" className="p-6">
              <h3 className="text-lg font-medium mb-4">Related Work Orders</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Work Order No</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Plan Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedWOData.map((wo, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{wo.workOrderNo}</TableCell>
                          <TableCell>{wo.asset}</TableCell>
                          <TableCell>{wo.planDueDate}</TableCell>
                          <TableCell>
                            <StatusBadge status={wo.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="p-6">
              <h3 className="text-lg font-medium mb-4">Reports</h3>
              <Card>
                <CardContent className="pt-6">
                  <Form {...reportForm}>
                    <form onSubmit={reportForm.handleSubmit(onReportSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={reportForm.control}
                          name="equipmentStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipment Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select equipment status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="operational">Operational</SelectItem>
                                  <SelectItem value="needsRepair">Needs Repair</SelectItem>
                                  <SelectItem value="offline">Offline</SelectItem>
                                  <SelectItem value="standby">Standby</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={reportForm.control}
                          name="sceResult"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SCE Result</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select SCE result" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pass">Pass</SelectItem>
                                  <SelectItem value="fail">Fail</SelectItem>
                                  <SelectItem value="conditional">Conditional Pass</SelectItem>
                                  <SelectItem value="notApplicable">Not Applicable</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={reportForm.control}
                        name="detailDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detail Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter detailed description" 
                                {...field}
                                className="min-h-[120px]"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">General Maintenance Checklist</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <FormField
                            control={reportForm.control}
                            name="cleaning"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">Cleaning</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={reportForm.control}
                            name="overhaul"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">Overhaul</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={reportForm.control}
                            name="tightenBolt"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">Tighten Bolt</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={reportForm.control}
                            name="lubrication"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">Lubrication</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button type="submit">Submit Report</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="defer" className="p-6">
              <h3 className="text-lg font-medium mb-4">Defer Information</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">New Due Date</h4>
                      <p className="text-base">{deferData.newDueDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Previous Due Date</h4>
                      <p className="text-base">{deferData.previousDueDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Requested By</h4>
                      <p className="text-base">{deferData.requestedBy}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Remarks</h4>
                      <Card className="bg-gray-50">
                        <CardContent className="pt-4">
                          <p className="text-gray-700">{deferData.remarks}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" /> Edit Defer Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attachment" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Attachments</h3>
              </div>
              
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Attachment Date</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Attachment File</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attachmentData.map((attachment, index) => (
                          <TableRow key={index}>
                            <TableCell>{attachment.type}</TableCell>
                            <TableCell>{attachment.attachmentDate}</TableCell>
                            <TableCell>{attachment.notes}</TableCell>
                            <TableCell className="text-blue-600 hover:underline cursor-pointer">
                              <div className="flex items-center gap-1">
                                <Paperclip className="h-4 w-4" />
                                {attachment.attachmentFile}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Upload New Attachment</h3>
                  </CardHeader>
                  <CardContent>
                    <Form {...attachmentForm}>
                      <form onSubmit={attachmentForm.handleSubmit(onAttachmentSubmit)} className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <FormLabel>File</FormLabel>
                          <div className="relative">
                            <Input
                              type="file"
                              className="cursor-pointer"
                              onChange={handleFileChange}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <Button type="button" variant="ghost" size="sm" className="h-full">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {files.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Selected: {files.map(f => f.name).join(', ')}
                            </p>
                          )}
                        </div>
                        
                        <FormField
                          control={attachmentForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter file description" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end pt-2">
                          <Button type="submit">Upload</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="min-acceptance-criteria" className="p-6">
              <h3 className="text-lg font-medium mb-4">Minimum Acceptance Criteria</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Criteria</TableHead>
                        <TableHead>Minimum Value</TableHead>
                        <TableHead>Maximum Value</TableHead>
                        <TableHead>Actual Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {minAcceptanceData.map((criteria, index) => (
                        <TableRow key={index}>
                          <TableCell>{criteria.criteria}</TableCell>
                          <TableCell>{criteria.minValue}</TableCell>
                          <TableCell>{criteria.maxValue}</TableCell>
                          <TableCell>{criteria.actualValue}</TableCell>
                          <TableCell>
                            <StatusBadge status={criteria.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="checksheet" className="p-6">
              <h3 className="text-lg font-medium mb-4">Checksheets</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checksheetData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.item}</TableCell>
                          <TableCell>
                            <Checkbox checked={item.completed} />
                          </TableCell>
                          <TableCell>{item.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="additional-info" className="p-6">
              <h3 className="text-lg font-medium mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Cost Center</h4>
                    <p className="text-base">CC-MAINT-001</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Estimated Cost</h4>
                    <p className="text-base">RM 5,000.00</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Actual Cost</h4>
                    <p className="text-base">RM 4,750.00</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Equipment Downtime</h4>
                    <p className="text-base">6 hours</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Safety Permits</h4>
                    <p className="text-base">Hot Work, Height Work</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Reference Documents</h4>
                    <p className="text-base">SOP-MAINT-105, MAN-EQUIP-001</p>
                  </div>
                </div>
                <div className="pt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                  <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                      <p className="text-gray-700">
                        Additional maintenance was performed on adjacent components while the system was offline.
                        Parts were sourced from inventory with no additional purchase required.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="maintainable-group" className="p-6">
              <h3 className="text-lg font-medium mb-4">Maintainable Group</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Code</TableHead>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Members</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintainableGroupData.map((group, index) => (
                        <TableRow key={index}>
                          <TableCell>{group.groupCode}</TableCell>
                          <TableCell>{group.groupName}</TableCell>
                          <TableCell>{group.members}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrderDetailPage;
