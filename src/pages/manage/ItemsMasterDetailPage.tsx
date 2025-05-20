import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, List, Paperclip, File, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemsMaster } from '@/data/sampleData';
import InventoryTabList from '@/components/shared/InventoryTabList';
import { useItemMasterDetail } from '@/hooks/queries/useItemsMaster';

const ItemsMasterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('itemMaster');
  const [files, setFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<{id: string, name: string, size: string, type: string, uploadDate: string}[]>([]);

  const { data, isLoading, error } = useItemMasterDetail(Number(id));
  console.log(data);
  

  // Find the item in sample data
  const item = itemsMaster.find(item => item.id === id);

  const formSchema = z.object({
    itemsNo: z.string().min(1, "Item No is required"),
    name: z.string().min(1, "Item Name is required"),
    category: z.string().min(1, "Category is required"),
    type: z.string().min(1, "Type is required"),
    manufacturer: z.string().min(1, "Manufacturer is required"),
    manufacturerPartsNo: z.string().min(1, "Manufacturer Parts No is required"),
    modelNo: z.string().optional(),
    unit: z.string().min(1, "Unit is required"),
    specification: z.string().optional(),
    criticality: z.string().min(1, "Criticality is required"),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemsNo: "",
      name: "",
      type: "",
      manufacturer: "",
      manufacturerPartsNo: "",
      unit: "",
      criticality: "",
    }
  });
  
  // Update form values when data loads
  useEffect(() => {
    if (data) {
      form.reset({
        itemsNo: data.item_no || "",
        name: data.item_name || "",
        type: data.type?.name || "",
        manufacturer: data.manufacturer?.name || "",
        manufacturerPartsNo: data.manufacturer_part_no || "",
        unit: data.unit?.name || "",
        criticality: data.criticality?.name || "",
      });
    }
  }, [data, form]);

  const onSubmit = (values: FormValues) => {
    console.log("Form values:", values);
    toast({
      title: "Changes saved",
      description: "Your changes have been applied successfully"
    });
    navigate('/manage/items-master');
  };

  const handleCancel = () => {
    navigate('/manage/items-master');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      // Create new attachment entries
      const newAttachments = newFiles.map(file => ({
        id: `attach-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
        uploadDate: new Date().toLocaleDateString()
      }));
      
      setAttachments([...attachments, ...newAttachments]);
      
      toast({
        title: "File uploaded",
        description: `${newFiles.length} file(s) have been uploaded successfully`
      });
    }
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
    toast({
      title: "Attachment deleted",
      description: "The attachment has been removed successfully"
    });
  };

  const typeOptions = [
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Instrumentation', label: 'Instrumentation' },
    { value: 'Safety', label: 'Safety' },
    { value: 'Process', label: 'Process' },
  ];

  const categoryOptions = [
    { value: 'Rotating Equipment', label: 'Rotating Equipment' },
    { value: 'Sealing', label: 'Sealing' },
    { value: 'Protection', label: 'Protection' },
    { value: 'Measurement', label: 'Measurement' },
    { value: 'Flow Control', label: 'Flow Control' },
  ];

  const manufacturerOptions = [
    { value: 'ABB', label: 'ABB' },
    { value: 'Siemens', label: 'Siemens' },
    { value: 'GE', label: 'General Electric' },
    { value: 'Schneider', label: 'Schneider Electric' },
    { value: 'Emerson', label: 'Emerson' },
  ];

  const unitOptions = [
    { value: 'Each', label: 'Each' },
    { value: 'Meter', label: 'Meter' },
    { value: 'Kilogram', label: 'Kilogram' },
    { value: 'Liter', label: 'Liter' },
    { value: 'Set', label: 'Set' },
  ];

  const criticalityOptions = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if(!data) {
    return <div>Item master not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Item Master Detail" 
          icon={<List className="h-6 w-6" />}
        />
        <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Items Master
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="itemMaster">Item Master</TabsTrigger>
              <TabsTrigger value="attachment">Attachment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="itemMaster" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="itemsNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item No. <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Item number" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {typeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select manufacturer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {manufacturerOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="manufacturerPartsNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer Parts No. <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter manufacturer parts number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="modelNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="criticality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Criticality <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select criticality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {criticalityOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="specification"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Specification</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter item specifications" 
                              {...field} 
                              className="min-h-[100px]" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Apply Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="attachment" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Attachments</h3>
                <div className="relative">
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              </div>
              
              {attachments.length > 0 ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="py-3 px-4 text-left font-medium">File Name</th>
                          <th className="py-3 px-4 text-left font-medium">Type</th>
                          <th className="py-3 px-4 text-left font-medium">Size</th>
                          <th className="py-3 px-4 text-left font-medium">Upload Date</th>
                          <th className="py-3 px-4 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attachments.map((file) => (
                          <tr key={file.id} className="border-b">
                            <td className="py-3 px-4 flex items-center gap-2">
                              <File className="h-4 w-4" />
                              {file.name}
                            </td>
                            <td className="py-3 px-4">{file.type}</td>
                            <td className="py-3 px-4">{file.size}</td>
                            <td className="py-3 px-4">{file.uploadDate}</td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteAttachment(file.id)}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md bg-muted/20">
                  <Paperclip className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No attachments yet. Upload files to see them here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemsMasterDetailPage;
