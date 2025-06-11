import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  useItemTypeOptions,
  useManufacturerOptions,
  useUnitOptions,
  useCriticalityOptions,
  useItemGroupOptions,
  useUpdateItemMaster,
  useItemMasterDetail,
} from "@/hooks/queries/useItemsMaster";
import { useCategoryOptions } from "@/hooks/queries/useItemsMaster";
import { useToast } from "@/hooks/use-toast";
import { validateImageFile } from "@/services/assetImageService";
import {
  ArrowLeft,
  Upload,
  Wrench,
  List,
  Paperclip,
  File,
  Trash2,
} from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

interface ItemAttachment {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  created_at: string;
}

// Zod validation schema
// const formSchema = z.object({
//   itemsNo: z.string().min(1, "Item No is required"),
//   itemsName: z.string().min(1, "Item Name is required"),
//   itemsGroup: z.string().min(1, "Item Group is required"),
//   category: z.string().min(1, "Category is required"),
//   type: z.string().min(1, "Type is required"),
//   manufacturer: z.string().min(1, "Manufacturer is required"),
//   partsNo: z.string().min(1, "Manufacturer Parts No is required"),
//   modelNo: z.string().min(1, "Model No is required"),
//   unit: z.string().min(1, "Unit is required"),
//   specification: z.string().min(1, "Specification is required"),
//   criticality: z.string().min(1, "Criticality is required"),
//   itemsAttachment: z
//     .array(z.any())
//     .optional()
//     .refine(
//       (files) => !files || files.every((file) => file instanceof File),
//       "Invalid file format"
//     ),
// });

const ItemsMasterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("items-master");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // attachments
  const [existingAttachments, setExistingAttachments] = useState<
    ItemAttachment[]
  >([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>(
    []
  );

  // Cascading dropdowns state
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );

  const [itemsAttachment, setItemsAttachment] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const validateFiles = (
    files: File[]
  ): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file, index) => {
      const error = validateImageFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  };

  // Options for dropdowns
  const { data: categoryOptions } = useCategoryOptions();
  const { data: manufacturerOptions } = useManufacturerOptions();
  const { data: itemTypeOptions } = useItemTypeOptions();
  const { data: itemsGroupOptions } = useItemGroupOptions();
  const { data: unitOptions } = useUnitOptions();
  const { data: criticalityOptions } = useCriticalityOptions();
  const updateItemMasterMutation = useUpdateItemMaster(Number(id));

  const { data: itemData, isLoading, error } = useItemMasterDetail(Number(id));

  // Form data
  const [formData, setFormData] = useState({
    itemsNo: "",
    itemsName: "",
    itemsGroup: "",
    category: "",
    type: "",
    manufacturer: "",
    partsNo: "",
    modelNo: "",
    unit: "",
    specification: "",
    criticality: "",
    itemsAttachment: [],
  });

  // Pre-populate form when data is available
  useEffect(() => {
    if (itemData) {
      setFormData({
        itemsNo: itemData.item_no || "",
        itemsName: itemData.item_name || "",
        itemsGroup: itemData.item_group?.id
          ? String(itemData.item_group.id)
          : "",
        category: itemData.item_category?.id
          ? String(itemData.item_category.id)
          : "",
        type: itemData.item_type?.id ? String(itemData.item_type.id) : "",
        manufacturer: itemData.item_manufacturer?.id
          ? String(itemData.item_manufacturer.id)
          : "",
        partsNo: itemData.manufacturer_part_no || "",
        modelNo: itemData.model_no || "",
        unit: itemData.item_unit?.id ? String(itemData.item_unit.id) : "",
        specification: itemData.specification || "",
        criticality: itemData.item_criticality?.id
          ? String(itemData.item_criticality.id)
          : "",
        itemsAttachment: [],
      });

      const fetchAttachments = async () => {
        if (itemData?.id) {
          try {
            const { data, error } = await supabase
              .from("e_item_master_attachment")
              .select(
                "id, file_name, file_type, file_size, file_path, created_at"
              )
              .eq("item_master_id", itemData.id);
            if (error) throw new Error(error.message);
            setExistingAttachments(data || []);
          } catch (error) {
            console.error("Error fetching attachments:", error);
            toast({
              title: "Error",
              description:
                error instanceof Error ? error.message : "An error occurred",
              variant: "destructive",
            });
          }
        }
      };

      if (itemData) {
        fetchAttachments();
      }
    }
  }, [itemData]);

  // Form handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!user.id) {
      toast({
        title: "Unauthorized",
        description: "You are not logged in",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    try {
      // formSchema.parse(formData);
      setErrors({});
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        validationError.issues.forEach((issue) => {
          const path = issue.path[0];
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);

        // Switch to first tab with error
        const firstErrorField = Object.keys(newErrors)[0];
        if (firstErrorField === "itemsAttachment") {
          setActiveTab("attachment");
        } else {
          setActiveTab("items-master");
        }

        return;
      }
    }

    setIsSubmitting(true);

    const transformedData = {
      id: Number(id),
      item_no: formData.itemsNo,
      item_name: formData.itemsName,
      item_group: Number(formData.itemsGroup),
      category_id: Number(formData.category),
      type_id: Number(formData.type),
      manufacturer: Number(formData.manufacturer),
      manufacturer_part_no: formData.partsNo,
      model_no: formData.modelNo,
      specification: formData.specification,
      unit_id: Number(formData.unit),
      criticality_id: Number(formData.criticality),
      is_active: true,
    };

    try {
      toast({
        title: "Updating item...",
      });

      // 1. Update the item master record
      await updateItemMasterMutation.mutateAsync(transformedData);

      // 2. Handle deleted attachments
      if (deletedAttachmentIds.length > 0) {
        try {
          const { error } = await supabase
            .from("e_item_master_attachment")
            .delete()
            .in("id", deletedAttachmentIds);

          if (error) throw error;
          toast({
            title: `Deleted ${deletedAttachmentIds.length} attachments`,
          });
        } catch (deleteError) {
          console.error("Error deleting attachments:", deleteError);
          toast({
            title: "Error deleting attachments",
            description: deleteError.message,
            variant: "destructive",
          });
        }
      }

      // 3. Upload new attachments
      if (itemsAttachment.length > 0) {
        try {
          const { uploadMultipleItemImages } = await import(
            "@/services/itemMasterAttachmentService"
          );

          await uploadMultipleItemImages(Number(id), itemsAttachment, user.id);

          toast({
            title: `Uploaded ${itemsAttachment.length} new attachments`,
          });
        } catch (uploadError) {
          console.error("Error uploading new attachments:", uploadError);
          toast({
            title: "Error uploading attachments",
            description: uploadError.message,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Item updated successfully",
        variant: "default",
      });
      navigate("/manage/items-master");
    } catch (error) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field === "category") {
      setSelectedCategory(value);
      setFormData({
        ...formData,
        [field]: value,
        type: "",
      });
      setSelectedType(undefined);
    } else if (field === "type") {
      setSelectedType(value);
      setFormData({
        ...formData,
        [field]: value,
      });
    } else if (field === "itemsAttachment") {
      const files = value as File[];
      if (files && files.length > 0) {
        const { validFiles, errors } = validateFiles(files);
        if (errors.length > 0) {
          setFileErrors((prev) => [...prev, ...errors]);
          toast({
            title: "File upload error",
            description: errors.join("\n"),
            variant: "destructive",
          });
        }

        if (validFiles.length > 0) {
          setItemsAttachment((prev) => [...prev, ...validFiles]);

          const newPreviews = Array.from(validFiles).map((file) => {
            return URL.createObjectURL(file);
          });
          setAttachmentPreviews((prev) => [...prev, ...newPreviews]);

          setFormData({
            ...formData,
            [field]: [...(formData.itemsAttachment as File[]), ...validFiles],
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleChange("itemsAttachment", Array.from(files));
    }
  };

  const removeImage = (index: number) => {
    setItemsAttachment((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setAttachmentPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData((prev) => {
      const currentAttachment = (prev.itemsAttachment as File[]) || [];
      const newAttachemnt = [...currentAttachment];
      newAttachemnt.splice(index, 1);
      return {
        ...prev,
        assetImage: newAttachemnt,
      };
    });

    // Clear any errors for the removed image
    setFileErrors((prev) => {
      if (prev.length <= index) return prev;
      const newErrors = [...prev];
      newErrors.splice(index, 1);
      return newErrors;
    });
  };

  const handleDeleteExistingAttachment = (id: number) => {
    setDeletedAttachmentIds((prev) => [...prev, id]);
    setExistingAttachments((prev) => prev.filter((attach) => attach.id !== id));
    toast({
      title: "Attachment marked for deletion",
      description: "The attachment will be removed when you save changes",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!itemData) {
    return <div>Item with id {id} not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Edit Item Master"
          icon={<Wrench className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate("/manage/items-master")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Item Master
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="items-master">Item Master</TabsTrigger>
                <TabsTrigger value="attachment">Attachment</TabsTrigger>
              </TabsList>
              {/* Items Master Tab */}
              <TabsContent value="items-master">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item_no">
                        Item No<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="item_no"
                        placeholder="Enter Item No"
                        value={formData.itemsNo}
                        onChange={(e) =>
                          handleChange("itemsNo", e.target.value)
                        }
                      />
                      {errors.itemsNo && (
                        <p className="text-red-500 text-sm">{errors.itemsNo}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemsGroup">
                        Item Group<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.itemsGroup}
                        onValueChange={(value) =>
                          handleChange("itemsGroup", value)
                        }
                      >
                        <SelectTrigger id="itemsGroup">
                          <SelectValue placeholder="Select Item Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemsGroupOptions?.map((options) => (
                            <SelectItem
                              key={options.id}
                              value={String(options.id)}
                            >
                              {options.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.itemsGroup && (
                        <p className="text-red-500 text-sm">
                          {errors.itemsGroup}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleChange("category", value)
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions?.map((options) => (
                            <SelectItem
                              key={options.id}
                              value={String(options.id)}
                            >
                              {options.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-sm">
                          {errors.category}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manufacturer">
                        Manufacturer<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.manufacturer}
                        onValueChange={(value) =>
                          handleChange("manufacturer", value)
                        }
                      >
                        <SelectTrigger id="manufacturer">
                          <SelectValue placeholder="Select Manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                          {manufacturerOptions?.map((options) => (
                            <SelectItem
                              key={options.id}
                              value={String(options.id)}
                            >
                              {options.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.manufacturer && (
                        <p className="text-red-500 text-sm">
                          {errors.manufacturer}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model_no">
                        Model No<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.modelNo}
                        onChange={(e) =>
                          handleChange("modelNo", e.target.value)
                        }
                        id="model_no"
                        placeholder="Enter Model No"
                      />
                      {errors.modelNo && (
                        <p className="text-red-500 text-sm">{errors.modelNo}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specification">
                        Specification<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.specification}
                        onChange={(e) =>
                          handleChange("specification", e.target.value)
                        }
                        id="specification"
                        placeholder="Enter Specification"
                      />
                      {errors.specification && (
                        <p className="text-red-500 text-sm">
                          {errors.specification}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Right Side Col of Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item_name">
                        Item Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.itemsName}
                        onChange={(e) =>
                          handleChange("itemsName", e.target.value)
                        }
                        id="item_name"
                        placeholder="Enter Item Name"
                      />
                      {errors.itemsName && (
                        <p className="text-red-500 text-sm">
                          {errors.itemsName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">
                        Type<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleChange("type", value)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemTypeOptions?.map((options) => (
                            <SelectItem
                              key={options.id}
                              value={String(options.id)}
                            >
                              {options.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-red-500 text-sm">{errors.type}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item_name">
                        Manufacturer Parts No.
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.partsNo}
                        onChange={(e) =>
                          handleChange("partsNo", e.target.value)
                        }
                        id="item_name"
                        placeholder="Enter Manufacturer Parts No."
                      />
                      {errors.partsNo && (
                        <p className="text-red-500 text-sm">{errors.partsNo}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">
                        Unit<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) => handleChange("unit", value)}
                      >
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions?.map((options) => (
                            <SelectItem
                              key={options.id}
                              value={String(options.id)}
                            >
                              {options.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.unit && (
                        <p className="text-red-500 text-sm">{errors.unit}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="criticality">
                        Criticality<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.criticality}
                        onValueChange={(value) =>
                          handleChange("criticality", value)
                        }
                      >
                        <SelectTrigger id="criticality">
                          <SelectValue placeholder="Select Criticality" />
                        </SelectTrigger>
                        <SelectContent>
                          {criticalityOptions?.map((options) => (
                            <SelectItem
                              key={options.id}
                              value={String(options.id)}
                            >
                              {options.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.criticality && (
                        <p className="text-red-500 text-sm">
                          {errors.criticality}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-6">
                      <Button
                        type="button"
                        onClick={() => setActiveTab("attachment")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              {/* Attachment Tab */}
              <TabsContent value="attachment">
                <div className="space-y-4">
                  <div className="space-y-2">

                    {/* Existing attachments */}
                    {existingAttachments.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">
                          Existing Attachments
                        </h3>
                        <div className="rounded-md border">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted border-b">
                                  <th className="py-3 px-4 text-left font-medium">
                                    File Name
                                  </th>
                                  <th className="py-3 px-4 text-left font-medium">
                                    Type
                                  </th>
                                  <th className="py-3 px-4 text-left font-medium">
                                    Size
                                  </th>
                                  <th className="py-3 px-4 text-left font-medium">
                                    Upload Date
                                  </th>
                                  <th className="py-3 px-4 text-right font-medium">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {existingAttachments.map((file) => (
                                  <tr key={file.id} className="border-b">
                                    <td className="py-3 px-4 flex items-center gap-2">
                                      <File className="h-4 w-4" />
                                      <a
                                        href={file.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        {file.file_name}
                                      </a>
                                    </td>
                                    <td className="py-3 px-4">
                                      {file.file_type
                                        .split("/")[1]
                                        ?.toUpperCase() || "IMAGE"}
                                    </td>
                                    <td className="py-3 px-4">
                                      {formatFileSize(file.file_size)}
                                    </td>
                                    <td className="py-3 px-4">
                                      {new Date(
                                        file.created_at
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() =>
                                          handleDeleteExistingAttachment(
                                            file.id
                                          )
                                        }
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
                      </div>
                    )}
                    {/* New attachments */}
                    <h3 className="text-lg font-medium mb-4">Add New Images</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center relative">
                      {attachmentPreviews.length > 0 ? (
                        <div className="w-full">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {attachmentPreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Asset Preview ${index + 1}`}
                                  className="h-[150px] w-full object-cover rounded-md"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={() => removeImage(index)}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col items-center mt-4">
                            <div className="relative w-full h-12">
                              <input
                                id="assetImage"
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                onChange={handleFileChange}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 z-20"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById("assetImage")?.click();
                              }}
                            >
                              Add More Images
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-10 w-10 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <div className="relative w-full h-12">
                            <input
                              id="assetImage"
                              type="file"
                              multiple
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                              onChange={handleFileChange}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 z-20"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById("assetImage")?.click();
                            }}
                          >
                            Select Files
                          </Button>
                        </div>
                      )}
                    </div>
                    {errors.itemsAttachment && (
                      <p className="text-red-500 text-sm">
                        {errors.itemsAttachment}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between space-x-2 pt-14">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("items-master")}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ItemsMasterDetailPage;
