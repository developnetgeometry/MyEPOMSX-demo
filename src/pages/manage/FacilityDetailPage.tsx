
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Building, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useFacility, useUpdateFacility } from '@/hooks/queries/useFacilities';
import { z } from 'zod';
import ManageDialog from '@/components/manage/ManageDialog';

const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: facility, isLoading, error } = useFacility(Number(id));
  const updateFacilityMutation = useUpdateFacility();

  const handleGoBack = () => {
    navigate('/manage/facilities');
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (!facility) return;
    
    try {
      await updateFacilityMutation.mutateAsync({
        id: facility.id,
        location_code: values.code,
        location_name: values.name,
        is_active: facility.is_active,
        project_id: facility.project_id
      });
      
      toast.success("Facility updated successfully");
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error updating facility: ${error.message}`);
    }
  };

  const formSchema = z.object({
    code: z.string().min(1, "Facility Location Code is required"),
    name: z.string().min(1, "Facility Location is required")
  });

  const formFields = [{
    name: 'code',
    label: 'Facility Location Code',
    type: 'text' as const
  }, {
    name: 'name',
    label: 'Facility Location',
    type: 'text' as const
  }];
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Loading facility details...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-center text-red-500">
        <p>Error loading facility: {(error as Error).message}</p>
        <Button onClick={handleGoBack} className="mt-4">
          Back to Facilities
        </Button>
      </div>
    </div>;
  }

  if (!facility) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p>Facility not found</p>
        <Button onClick={handleGoBack} className="mt-4">
          Back to Facilities
        </Button>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Facility Detail" 
          icon={<Building className="h-6 w-6" />}
        />
        <Button 
          variant="outline" 
          onClick={handleGoBack} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Facilities
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
                <TableCell className="font-medium">Facility Location Code</TableCell>
                <TableCell>{facility.location_code}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Facility Location</TableCell>
                <TableCell>{facility.location_name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ManageDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        title="Edit Facility" 
        formSchema={formSchema} 
        defaultValues={{
          code: facility.location_code,
          name: facility.location_name || ""
        }} 
        formFields={formFields} 
        onSubmit={handleSubmit} 
        isEdit={true} 
        isProcessing={updateFacilityMutation.isPending} 
      />
    </div>
  );
};

export default FacilityDetailPage;
