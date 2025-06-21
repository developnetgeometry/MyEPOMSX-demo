import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  useProjectData,
  insertProjectData,
  updateProjectData,
  deleteProjectData,
} from "../hooks/use-project-data";
import ProjectDialogForm from "./ProjectDialogForm";
import AdminLayout from "@/components/layout/AdminLayout";
import { findProjects, ProjectFilter } from "@/utils/project-data-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading, refetch } = useProjectData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const { toast } = useToast();
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  // Enhanced search functionality using project-data-utils
  useEffect(() => {
    const fetchFilteredProjects = async () => {
      if (searchQuery.trim() === "") {
        setFilteredProjects(projects || []);
        return;
      }

      const filter: ProjectFilter = {
        searchTerm: searchQuery,
        sortBy: "name",
      };

      try {
        const results = await findProjects(filter);
        setFilteredProjects(results);
      } catch (error) {
        console.error("Error searching projects:", error);
        setFilteredProjects(projects || []);
      }
    };

    if (!isLoading && projects) {
      fetchFilteredProjects();
    }
  }, [searchQuery, projects, isLoading]);

  const handleRowClick = (row: any) => {
    navigate(`/admin/setup/project/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async (project: any) => {
    try {
      await deleteProjectData(project.id);
      toast({
        title: "Success",
        description: "Project deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete project data:", error);
      toast({
        title: "Error",
        description: "Failed to delete project data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingProject) {
        await updateProjectData(editingProject.id, formData);
        toast({
          title: "Success",
          description: "Project updated successfully!",
          variant: "default",
        });
      } else {
        await insertProjectData(formData);
        toast({
          title: "Success",
          description: "Project added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save project data:", error);
      toast({
        title: "Error",
        description: "Failed to save project data.",
        variant: "destructive",
      });
    }
  };

  // Removed duplicate filteredProjects declaration to avoid redeclaration error.

  const columns: Column[] = [
    { id: "project_code", header: "Project Code", accessorKey: "project_code" },
    { id: "project_name", header: "Project Name", accessorKey: "project_name" },
    { id: "short_name", header: "Short Name", accessorKey: "short_name" },
    {
      id: "project_type",
      header: "Project Type",
      accessorKey: "project_type.name",
    },
    {
      id: "start_date",
      header: "Start Date",
      accessorKey: "start_date",
      cell: (value: any) => formatDate(value),
    },
    {
      id: "end_date",
      header: "End Date",
      accessorKey: "end_date",
      cell: (value: any) => formatDate(value),
    },
    { id: "fund_code", header: "Fund Code", accessorKey: "fund_code" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Setup"
        onAddNew={handleAddNew}
        addNewLabel="New Project"
        onSearch={handleSearch}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredProjects}
          onRowClick={handleRowClick}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onIndex={true}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
                <DialogDescription>
                  {editingProject
                    ? "Update the details of the project."
                    : "Fill in the details to add a new project."}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ProjectDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingProject}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrap the component with AdminLayout for consistency with other admin pages
// const ProjectPageWithLayout = () => {
//   return (
//     <AdminLayout>
//       <ProjectPage />
//     </AdminLayout>
//   );
// };

// export default ProjectPageWithLayout;
export default ProjectPage;
