import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Plus } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Column } from "@/components/shared/DataTable";
import { Facility } from "@/types/manage";
import ManageDialog from "@/components/manage/ManageDialog";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useLoadingState } from "@/hooks/use-loading-state";
import {
  useFacilities,
  useAddFacility,
  useUpdateFacility,
  facilityKeys,
} from "@/hooks/queries/useFacilities";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce";
import { useProject } from "@/contexts/ProjectContext";

// Memoized form schema
const formSchema = z.object({
  code: z.string().min(1, "Facility Location Code is required"),
  name: z.string().min(1, "Facility Location is required"),
  is_active: z.boolean().default(true),
});

// Static form fields
const formFields = [
  {
    name: "code",
    label: "Facility Location Code",
    type: "text" as const,
  },
  {
    name: "name",
    label: "Facility Location",
    type: "text" as const,
  },
  {
    name: "is_active",
    label: "Active",
    type: "checkbox" as const,
  },
];

const FacilitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentProject } = useProject();
  const projectId = currentProject?.id;
  

  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<Facility | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Custom hooks
  const { isLoading: isProcessing, withLoading } = useLoadingState();

  // TanStack Query hooks
  const { data: facilities, isLoading, error } = useFacilities();
  const addFacilityMutation = useAddFacility();
  const updateFacilityMutation = useUpdateFacility();

  // Memoized columns
  const columns = useMemo<Column[]>(() => [
    {
      id: "location_code",
      header: "Facility Location Code",
      accessorKey: "location_code",
    },
    {
      id: "location_name",
      header: "Facility Location",
      accessorKey: "location_name",
    },
  ], []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!facilities) return [];
    if (!debouncedSearchTerm.trim()) return facilities;

    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return facilities.filter(
      (item) =>
        item.location_name?.toLowerCase().includes(lowerSearch) ||
        item.location_code.toLowerCase().includes(lowerSearch)
    );
  }, [facilities, debouncedSearchTerm]);

  // Callbacks
  const handleAddNew = useCallback(() => {
    setIsEditMode(false);
    setCurrentItem(null);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((item: Facility) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  }, []);

  const handleSubmit = useCallback((values: any) => {
    withLoading(async () => {
      try {
        if (isEditMode && currentItem) {
        // Edit existing
        await updateFacilityMutation.mutateAsync({
          id: Number(currentItem.id),
          location_code: values.code,
          location_name: values.name,
          is_active: values.is_active,
          project_id: currentItem.project_id,
        });
      } else if (projectId) {
        // Add new - use currentProject directly
        await addFacilityMutation.mutateAsync({
          location_code: values.code,
          location_name: values.name,
          is_active: values.is_active,
          project_id: Number(projectId),
        });
      }
        toast({
          title: "Facility saved successfully",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: facilityKeys.all });
        setIsDialogOpen(false);
      } catch (error: any) {
        console.error("Error saving facility:", error);
        toast({
          title: "Error saving facility",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  }, [currentItem, isEditMode, withLoading]);


  const handleSearch = useCallback(() => {
    // Already handled in memoized filteredData
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading facilities...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p>Error loading facilities: {(error as Error).message}</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["facilities"] })
            }
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facilities"
        subtitle="Manage facilities"
        icon={<Building className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="Add Facility"
      />

      <Card>
        <CardContent className="pt-6">
          <SearchFilters
            text="Facility"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />

          <DataTable
            data={filteredData}
            columns={columns}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={isEditMode ? "Edit Facility" : "Add New Facility"}
        formSchema={formSchema}
        defaultValues={
          currentItem
            ? {
                code: currentItem.location_code,
                name: currentItem.location_name || "",
                is_active: currentItem.is_active ?? true,
              }
            : {
                code: "",
                name: "",
                is_active: true,
              }
        }
        formFields={formFields}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
        isProcessing={
          isProcessing ||
          addFacilityMutation.isPending ||
          updateFacilityMutation.isPending
        }
      />
    </div>
  );
};

export default React.memo(FacilitiesPage);