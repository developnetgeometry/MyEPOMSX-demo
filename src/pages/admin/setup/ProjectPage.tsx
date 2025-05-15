import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { useProjectData, insertProjectData, updateProjectData, deleteProjectData } from "./hooks/use-project-data";
import ProjectDialogForm from "./ProjectDialogForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading, refetch } = useProjectData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const { toast } = useToast();

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

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery) return projects;
    const lower = searchQuery.toLowerCase();
    return projects.filter(
      (project: any) =>
        project.project_code?.toLowerCase().includes(lower) ||
        project.project_name?.toLowerCase().includes(lower) ||
        project.short_name?.toLowerCase().includes(lower) ||
        project.project_type?.name.toLowerCase().includes(lower) ||
        project.start_date?.toLowerCase().includes(lower) ||
        project.end_date?.toLowerCase().includes(lower) ||
        project.fund_code?.toLowerCase().includes(lower) ||
        project.project_purpose?.toLowerCase().includes(lower) ||
        project.remark?.toLowerCase().includes(lower)
    );
  }, [projects, searchQuery]);

  const columns: Column[] = [
    { id: "project_code", header: "Project Code", accessorKey: "project_code" },
    { id: "project_name", header: "Project Name", accessorKey: "project_name" },
    { id: "short_name", header: "Short Name", accessorKey: "short_name" },
    { id: "project_type", header: "Project Type", accessorKey: "project_type.name" },
    { id: "start_date", header: "Start Date", accessorKey: "start_date" },
    { id: "end_date", header: "End Date", accessorKey: "end_date" },
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
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the details of the project."
                : "Fill in the details to add a new project."}
            </DialogDescription>
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

export default ProjectPage;