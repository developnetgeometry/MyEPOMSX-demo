import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { System } from "@/types/manage";
import {
  useCreateSystem,
  useDeleteSystem,
  useSystems,
  useUpdateSystem,
} from "@/hooks/queries/useSystems";
import { useLoadingState } from "@/hooks/use-loading-state";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const SystemPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSystem, setNewSystem] = useState({
    system_code: "",
    system_name: "",
    is_active: true,
    facility_id: null,
    system_no: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<System | null>(null);
  

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSystems, setFilteredSystems] = useState<System[]>([]);

  const { isLoading: isProcessing, withLoading } = useLoadingState();

  // Query to fetch systems
  const { data: systems, isLoading } = useSystems();
  const addSystemMutation = useCreateSystem();
  const updateSystemMutation = useUpdateSystem();
  const deleteSystemMutation = useDeleteSystem();

  useEffect(() => {
    if (!systems) return;

    if (!searchTerm.trim()) {
      setFilteredSystems(systems);
      return;
    }

    const filtered = systems.filter(
      (item) =>
        item.system_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        item.system_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredSystems(filtered);

    if (filtered.length === 0 && searchTerm.trim() !== "") {
      toast({
        title: "No matching systems found",
        description: "Please try a different search term.",
        variant: "destructive",
      });
    }
  }, [systems, searchTerm]);

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setIsDialogOpen(true);
  };
  const handleEdit = (item: System) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setNewSystem({
      system_code: item.system_code,
      system_name: item.system_name || '',
      is_active: item.is_active,
      facility_id: item.facility_id,
      system_no: item.system_no,
    });
    setIsDialogOpen(true);
};

  const handleDelete = async (item: System) => {
    withLoading(async () => {
      try {
        await deleteSystemMutation.mutateAsync(item.id);
        toast({
          title: "System deleted successfully",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Error deleting system",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  // Handle search function
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    withLoading(async () => {
      try {
        // Validate required fields
        if (!newSystem.system_code || !newSystem.system_name) {
          toast({
            title: "Validation Error",
            description: "System ID and System Name are required",
            variant: "destructive",
          });
          return;
        }

        if (isEditMode && currentItem) {
          // Update existing system
          const updatedSystem = {
            ...currentItem,
            system_code: newSystem.system_code,
            system_name: newSystem.system_name,
            is_active: newSystem.is_active,
            system_no: newSystem.system_no,
          };

          await updateSystemMutation.mutateAsync(updatedSystem);
          toast({
            title: "System updated successfully",
            variant: "default",
          });
        } else {
          // Create new system
          await addSystemMutation.mutateAsync(newSystem);
          toast({
            title: "System created successfully",
            variant: "default",
          });
        }

        // Close dialog and reset form
        setIsDialogOpen(false);
        setNewSystem({
          system_code: "",
          system_name: "",
          is_active: true,
          facility_id: null,
          system_no: null,
        });
      } catch (error: any) {
        toast({
          title: isEditMode ? "Error updating system" : "Error creating system",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const columns: Column[] = [
    {
      id: "system_code",
      header: "System ID",
      accessorKey: "system_code",
    },
    {
      id: "system_name",
      header: "Name",
      accessorKey: "system_name",
    },
    {
      id: "system_no",
      header: "System Number",
      accessorKey: "system_no",
    },
    {
      id: "is_active",
      header: "Status",
      accessorKey: "is_active",
      cell: (original) => (original ? "Active" : "Inactive"),
    },
  ];

  const handleRowClick = (row: System) => {
    navigate(`/manage/system/${row.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Systems"
        subtitle="Manage plant systems and subsystems"
        onAddNew={handleAddNew}
        addNewLabel="Add System"
        onSearch={handleSearch}
      />

      <DataTable
        columns={columns}
        data={filteredSystems}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New System</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new system.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="system_code">System ID</Label>
              <Input
                id="system_code"
                value={newSystem.system_code}
                onChange={(e) =>
                  setNewSystem({ ...newSystem, system_code: e.target.value })
                }
                required
                placeholder="e.g. SYS006"
              />
            </div>

            <div>
              <Label htmlFor="system_name">System Name</Label>
              <Input
                id="system_name"
                value={newSystem.system_name || ""}
                onChange={(e) =>
                  setNewSystem({ ...newSystem, system_name: e.target.value })
                }
                required
                placeholder="System name"
              />
            </div>

            <div>
              <Label htmlFor="system_no">System Number</Label>
              <Input
                id="system_no"
                value={newSystem.system_no || ""}
                onChange={(e) =>
                  setNewSystem({ ...newSystem, system_no: e.target.value })
                }
                placeholder="System number"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="is_active"
                checked={!!newSystem.is_active}
                onCheckedChange={(checked) =>
                  setNewSystem({ ...newSystem, is_active: checked === true })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create System</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemPage;
