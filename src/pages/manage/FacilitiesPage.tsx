import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useLoadingState } from "@/hooks/use-loading-state";
import {
  useFacilities,
  useAddFacility,
  useUpdateFacility,
} from "@/hooks/queries/useFacilities";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const FacilitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<Facility | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Facility[]>([]);

  // Custom hooks
  const { isLoading: isProcessing, withLoading } = useLoadingState();

  // TanStack Query hooks
  const { data: facilities, isLoading, error } = useFacilities();
  const addFacilityMutation = useAddFacility();
  const updateFacilityMutation = useUpdateFacility();

  // Update filtered data when facilities data changes or search term is applied
  useEffect(() => {
    if (!facilities) return;

    if (!searchTerm.trim()) {
      setFilteredData(facilities);
      return;
    }

    const filtered = facilities.filter(
      (item) =>
        item.location_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        item.location_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filtered);

    if (filtered.length === 0 && searchTerm.trim() !== "") {
      toast({
        title: "No matching facilities found",
        description: "Please try a different search term.",
        variant: "destructive",
      });
    }
  }, [facilities, searchTerm]);

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Facility) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmit = (values: any) => {
    withLoading(async () => {
      try {
        if (isEditMode && currentItem) {
          await updateFacilityMutation.mutateAsync({
            id: Number(currentItem.id),
            location_code: values.code,
            location_name: values.name,
            is_active: values.is_active,
            project_id: currentItem.project_id,
          });
          toast({
            title: "Facility updated successfully",
            variant: "default",
          });
        } else {
          await addFacilityMutation.mutateAsync({
            location_code: values.code,
            location_name: values.name,
            is_active: values.is_active,
            project_id: null,
          });
          toast({
            title: "Facility added successfully",
            variant: "default",
          });
        }
        setIsDialogOpen(false);
      } catch (error: any) {
        toast({
          title: "Error saving facility",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleSearch = () => {
    // The filtering happens in the useEffect
    // This is just to trigger immediate search on button click
    if (!facilities) return;

    if (!searchTerm.trim()) {
      setFilteredData(facilities);
      return;
    }

    const filtered = facilities.filter(
      (item) =>
        item.location_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        item.location_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filtered);

    if (filtered.length === 0) {
      toast({
        title: "No matching facilities found",
        description: "Please try a different search term.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
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
  ];

  const formSchema = z.object({
    code: z.string().min(1, "Facility Location Code is required"),
    name: z.string().min(1, "Facility Location is required"),
    is_active: z.boolean().default(true),
  });

  const formFields = [
    {
      name: "code",
      label: "Facility Location Code",
      type: "text" as const,
      readonly: isEditMode,
      disabled: isEditMode,
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
        icon={<Building className="h-6 w-6" />}
        onAddNew={handleAddNew}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {/* <Button onClick={handleSearch}>Search</Button> */}
              </div>
            </div>
          </div>

          <DataTable
            data={filteredData}
            columns={columns}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!isProcessing) setIsDialogOpen(open);
        }}
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

export default FacilitiesPage;
