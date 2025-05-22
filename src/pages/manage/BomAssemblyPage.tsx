
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { BomAssembly, SparePart } from '@/types/material';
import ManageDialog from '@/components/manage/ManageDialog';
import { Column } from '@/components/shared/DataTable';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import TableFilters from '@/components/shared/TableFilters';
import { useLoadingState } from '@/hooks/use-loading-state';
import { useAddSparePartToBom, useBomAssembly, useCreateBomAssembly, useDeleteBomAssembly, useDeleteSparePart, useItemMasterOptions, useSpareParts, useUpdateBomAssembly, useUpdateSparePart } from '@/hooks/queries/useBomAssembly';
import { useToast } from '@/hooks/use-toast';

const BomAssemblyPage: React.FC = () => {
  // Base states
  const { data: bomAssemblies, isLoading, error } = useBomAssembly();
  const [selectedAssembly, setSelectedAssembly] = useState<string | null>(null);

  const { data: spareParts = [], isLoading: isSparePartsLoading } = useSpareParts(Number(selectedAssembly) || 0);
  const {data: itemMasterOptions = []} = useItemMasterOptions();

  // Mutations
  const createBomMutation = useCreateBomAssembly();
  const updateBomMutation = useUpdateBomAssembly();
  const deleteBomMutation = useDeleteBomAssembly();
  const addSparePartMutation = useAddSparePartToBom();
  const updateSparePartMutation = useUpdateSparePart();
  const deleteSparePartMutation = useDeleteSparePart();
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<BomAssembly | null>(null);
  
  // Spare parts dialog states
  const [isSparePartDialogOpen, setIsSparePartDialogOpen] = useState(false);
  const [isSparePartEditMode, setIsSparePartEditMode] = useState(false);
  const [currentSparePart, setCurrentSparePart] = useState<SparePart | null>(null);
  
  // Filter states
  const [filteredData, setFilteredData] = useState<BomAssembly[]>([]);
  const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>([]);

  
  // Loading states
  const { isLoading: isAssemblyProcessing, withLoading: withAssemblyLoading } = useLoadingState();
  const { isLoading: isSparePartProcessing, withLoading: withSparePartLoading } = useLoadingState();

  const { toast } = useToast();

  useEffect(() => {
    if (selectedAssembly && spareParts) {
      setFilteredSpareParts(spareParts);
    }
  },[selectedAssembly, spareParts]);

  useEffect(() => {
    // Sync bom assemblies data
    setFilteredData(bomAssemblies || []);
  }, [bomAssemblies]);
  
  useEffect(() => {
    // Sync spare parts data
    if (selectedAssembly) {
      setFilteredSpareParts(spareParts || []);
    } else {
      setFilteredSpareParts([]);
    }
  }, [selectedAssembly, spareParts]);
  
  // Assembly handlers
  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: BomAssembly) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: BomAssembly) => {
    deleteBomMutation.mutate(item.id, {
      onSuccess: () => toast({
        title: "Assembly deleted successfully",
        variant: "default",
      }),
      onError: (error) => toast({
        title: "Error deleting assembly",
        description: error.message,
        variant: "destructive",
      }),
    });
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const now = new Date();
    
    if (isEditMode && currentItem) {
      // Update existing BOM Assembly
      updateBomMutation.mutate(
        {
          id: currentItem.id,
          updates: {
            bom_code: values.code,
            bom_name: values.name,
            description: values.description || null,
            updated_at: now,
            item_master_id: currentItem.item_master_id,
          }
        },
        {
          onSuccess: () => {
            toast({
              title: "BOM Assembly Updated",
              description: `${values.code} has been updated successfully`,
              variant: "default",
            });
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Update Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      );
    } else {
      // Create new BOM Assembly
      createBomMutation.mutate(
        {
          bom_code: values.code,
          bom_name: values.name,
          description: values.description || null,
          created_at: now,
          item_master_id: null
        },
        {
          onSuccess: () => {
            toast({
              title: "BOM Assembly Created",
              description: `${values.code} has been created successfully`,
              variant: "default",
            });
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Creation Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  // Spare part handlers
  const handleAddNewSparePart = () => {
    if (!selectedAssembly) return;
    
    setIsSparePartEditMode(false);
    setCurrentSparePart(null);
    setIsSparePartDialogOpen(true);
  };

  const handleEditSparePart = (item: SparePart) => {
    setIsSparePartEditMode(true);
    setCurrentSparePart(item);
    setIsSparePartDialogOpen(true);
  };

  const handleDeleteSparePart = (item: SparePart) => {
    deleteSparePartMutation.mutate(item.id, {
      onSuccess: () => toast({
        title: "Spare part deleted successfully",
        variant: "default",
      }),
      onError: (error) => toast({
        title: "Error deleting spare part",
        description: error.message,
        variant: "destructive",
      }),
    });
  };

  const handleSubmitSparePart = (values: z.infer<typeof sparePartFormSchema>) => {
    if (!selectedAssembly) return;
  
    if (isSparePartEditMode && currentSparePart) {
      updateSparePartMutation.mutate(
        {
          id: currentSparePart.id,
          updates: {
            item_master_id: Number(values.item_master_id),
            description: values.description,
            bom_id: currentSparePart.bom_id,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Spare part Updated",
              description: `${values.description} has been updated successfully`,
              variant: "default",
            });
            setIsSparePartDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Update Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      );
    } else {
      addSparePartMutation.mutate(
        {
          bom_id: Number(selectedAssembly),
          item_master_id: Number(values.item_master_id),
          description: values.description,
        },
        {
          onSuccess: () => {
            toast({
              title: "Spare part Created",
              description: `${values.description} has been created successfully`,
              variant: "default",
            });
            setIsSparePartDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Creation Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleAssemblySearch = (query: string) => {
    const dataToFilter = bomAssemblies || [];
    if (!query) {
      setFilteredData(dataToFilter);
      return;
    }
    
    const filtered = dataToFilter.filter(item => 
      item.bom_code.toLowerCase().includes(query.toLowerCase()) || 
      (item.bom_name && item.bom_name.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredData(filtered);
  };
  
  const handleSparePartSearch = (query: string) => {
    const dataToFilter = spareParts || [];
    if (!query) {
      setFilteredSpareParts(dataToFilter);
      return;
    }
    
    const filtered = dataToFilter.filter(part => 
      (part.item_master?.item_name?.toLowerCase().includes(query.toLowerCase())) ||
      (part.item_master?.item_no?.toLowerCase().includes(query.toLowerCase())) ||
      (part.description && part.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredSpareParts(filtered);
  };
  
  // Row selection handler
  const handleAssemblySelect = (item: BomAssembly) => {
    setSelectedAssembly(String(item.id));
    
    // Reset spare parts filter when selecting new assembly
    setFilteredSpareParts(spareParts || []);
  };

  // Define column configurations
  const columns: Column[] = [
    {
      id: 'bom_code',
      header: 'BOM Assembly Code',
      accessorKey: 'bom_code',
    },
    {
      id: 'bom_name',
      header: 'BOM Assembly Name',
      accessorKey: 'bom_name',
    },
  ];

  const sparePartColumns: Column[] = [
    {
      id: 'item_master.item_name',
      header: 'Spare Part',
      accessorKey: 'item_master.item_name',
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
    },
    {
      id: 'item_master.item_no',
      header: 'Part Number',
      accessorKey: 'item_master.item_no',
    }
  ];

  // Form schemas
  const formSchema = z.object({
    code: z.string().min(1, "BOM Assembly Code is required"),
    name: z.string().min(1, "BOM Assembly Name is required"),
    description: z.string().optional(),
  });

  const sparePartFormSchema = z.object({
    item_master_id: z.number().min(1, "Please select a spare part"),
    description: z.string().optional(),
  });

  // Form field definitions
  const formFields = [
    { name: 'code', label: 'BOM Code', type: 'text' as const },
    { name: 'name', label: 'BOM Name', type: 'text' as const },
    { name: 'description', label: 'Description', type: 'text' as const },
  ];

  const sparePartFormFields = [
    { 
      name: 'item_master_id', 
      label: 'Spare Part', 
      type: 'select' as const,
      options: itemMasterOptions.map((option) => {
        return {
          value: String(option.value),
          label: option.label,
        };
      })
    },
    { 
      name: 'description', 
      label: 'Description', 
      type: 'textarea' as const 
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="BOM Assembly" 
        icon={<Layers className="h-6 w-6" />}
        onAddNew={handleAddNew}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">BOM Assemblies</h3>
            </div>
            
            <TableFilters 
              onSearch={handleAssemblySearch}
              onAddNew={handleAddNew}
              addNewLabel="Add Assembly"
              placeholder="Search assemblies..."
            />
            
            <DataTable 
              data={filteredData} 
              columns={columns} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              pageSize={5}
              onRowClick={handleAssemblySelect}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Spare Parts</h3>
              <Button
                onClick={handleAddNewSparePart}
                disabled={!selectedAssembly}
                className="flex gap-2 items-center"
              >
                <Plus className="h-4 w-4" /> Add Spare Part
              </Button>
            </div>
            
            {selectedAssembly && (
              <TableFilters 
                onSearch={handleSparePartSearch}
                placeholder="Search spare parts..."
              />
            )}
            
            {selectedAssembly ? (
              <DataTable 
                data={filteredSpareParts} 
                columns={sparePartColumns} 
                onEdit={handleEditSparePart}
                onDelete={handleDeleteSparePart}
                pageSize={5}
                isLoading={isSparePartsLoading}
              />
            ) : (
              <div className="p-4 border rounded-md bg-muted/50 text-center">
                <p className="text-muted-foreground">
                  Select a BOM Assembly to view associated spare parts
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!isAssemblyProcessing) setIsDialogOpen(open);
        }}
        title={isEditMode ? "Edit BOM Assembly" : "Add New BOM Assembly"}
        formSchema={formSchema}
        defaultValues={currentItem || { code: "", name: "" }}
        formFields={formFields}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
        isProcessing={isAssemblyProcessing}
      />

      <ManageDialog
        open={isSparePartDialogOpen}
        onOpenChange={(open) => {
          if (!isSparePartProcessing) setIsSparePartDialogOpen(open);
        }}
        title={isSparePartEditMode ? "Edit Spare Part" : "Add New Spare Part"}
        formSchema={sparePartFormSchema}
        defaultValues={currentSparePart || { item_master_id: undefined, description: "" }}
        formFields={sparePartFormFields}
        onSubmit={handleSubmitSparePart}
        isEdit={isSparePartEditMode}
        isProcessing={isSparePartProcessing}
      />
    </div>
  );
};

export default BomAssemblyPage;
