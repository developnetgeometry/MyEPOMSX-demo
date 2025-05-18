import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Layers, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { systemService } from '@/services/systemService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { z } from 'zod';
import ManageDialog from '@/components/manage/ManageDialog';

const SystemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Convert ID to number for the API call
  const systemId = id ? parseInt(id, 10) : 0;
  
  // Fetch system data using React Query
  const { 
    data: system, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['system', systemId],
    queryFn: () => systemService.getSystemById(systemId),
    enabled: !!systemId && !isNaN(systemId),
  });

  // Mutation for updating system
  const updateSystemMutation = useMutation({
    mutationFn: (updatedSystem: Partial<Omit<typeof system, 'id'>>) => 
      systemService.updateSystem(systemId, updatedSystem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', systemId] });
      toast({
        title: 'Success',
        description: 'System updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      // Define error patterns and their corresponding friendly messages
      const errorPatterns = {
        systemCodeDuplicate: {
          patterns: ['duplicate system_code', 'system_code already exists', 'unique constraint system_code'],
          title: 'Duplicate System ID',
          description: 'This System ID already exists. Please use a different System ID.'
        },
        systemNameDuplicate: {
          patterns: ['duplicate system_name', 'system_name already exists', 'unique constraint system_name'],
          title: 'Duplicate System Name',
          description: 'This System Name already exists. Please use a different name.'
        },
        networkError: {
          patterns: ['network', 'connection', 'timeout', 'unreachable'],
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please check your network connection and try again.'
        },
        permissionError: {
          patterns: ['permission', 'unauthorized', 'forbidden', 'access denied'],
          title: 'Permission Denied',
          description: 'You do not have permission to update this system. Please contact your administrator.'
        }
      };
      
      const errorMessage = error.message.toLowerCase();
      
      // Find the first matching error pattern
      const matchedError = Object.values(errorPatterns).find(errorType => 
        errorType.patterns.some(pattern => errorMessage.includes(pattern))
      );
      
      // Display the appropriate toast message
      if (matchedError) {
        toast({
          title: matchedError.title,
          description: matchedError.description,
          variant: 'destructive',
        });
      } else {
        // Fallback for unmatched errors
        toast({
          title: 'Error Updating System',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleSubmit = async (values: any) => {
    if (!system) return;
    
    try {
      await updateSystemMutation.mutateAsync({
        system_code: values.system_code,
        system_name: values.system_name,
        system_no: values.system_no,
        is_active: values.is_active
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  // Define form schema for validation
  const formSchema = z.object({
    system_code: z.string().min(1, "System ID is required"),
    system_name: z.string().min(1, "System Name is required"),
    system_no: z.string().optional(),
    is_active: z.union([
      z.boolean(),
      z.string().transform(val => val === 'true')
    ]).default(true)
  });

  // Define form fields for the dialog
  const formFields = [
    {
      name: 'system_code',
      label: 'System ID',
      type: 'text' as const
    }, 
    {
      name: 'system_name',
      label: 'System Name',
      type: 'text' as const
    },
    {
      name: 'system_no',
      label: 'System Number',
      type: 'text' as const
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ]
    }
  ];
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader 
            title="System Detail" 
            icon={<Layers className="h-6 w-6" />}
          />
          <Button 
            variant="outline" 
            onClick={() => navigate('/manage/system')} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Systems
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state (though the onError should redirect)
  if (isError || !system) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive text-lg">
          {error instanceof Error ? error.message : 'Failed to load system details'}
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/manage/system')} 
          className="mt-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Systems
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title={`System: ${system.system_name}`} 
          subtitle={`ID: ${system.system_code}`}
          icon={<Layers className="h-6 w-6" />}
        />
        <Button 
          variant="outline" 
          onClick={() => navigate('/manage/system')} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Systems
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">System ID</TableCell>
                <TableCell>{system.system_code}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">System Name</TableCell>
                <TableCell>{system.system_name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">System Number</TableCell>
                <TableCell>{system.system_no || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${system.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {system.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              {/* Conditionally render facility info if available */}
              {system.facility_id && (
                <TableRow>
                  <TableCell className="font-medium">Facility ID</TableCell>
                  <TableCell>{system.facility_id}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <ManageDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        title="Edit System" 
        formSchema={formSchema} 
        defaultValues={{
          system_code: system.system_code,
          system_name: system.system_name || "",
          system_no: system.system_no || "",
          is_active: String(system.is_active)
        }} 
        formFields={formFields} 
        onSubmit={handleSubmit} 
        isEdit={true} 
        isProcessing={updateSystemMutation.isPending} 
      />
    </div>
  );
};

export default SystemDetailPage;