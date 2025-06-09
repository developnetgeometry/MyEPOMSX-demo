import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";

export const ProjectDebug: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    currentProject,
    projects,
    loading: projectLoading,
    error,
    refreshProjects,
  } = useProject();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleRefreshProjects = () => {
    console.log("Manual project refresh triggered");
    refreshProjects();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded p-4 shadow-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Auth Loading: {authLoading ? "Yes" : "No"}</div>
        <div>User ID: {user?.id || "None"}</div>
        <div>Project Loading: {projectLoading ? "Yes" : "No"}</div>
        <div>Projects Count: {projects.length}</div>
        <div>Current Project: {currentProject?.name || "None"}</div>
        <div>Current Project ID: {currentProject?.id || "None"}</div>
        {error && <div className="text-red-600">Error: {error}</div>}
        <Button
          onClick={handleRefreshProjects}
          size="sm"
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
          disabled={projectLoading}
        >
          {projectLoading ? "Refreshing..." : "Refresh Projects"}
        </Button>
      </div>
    </div>
  );
};
