import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const ProjectDebug: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    currentProject,
    projects,
    loading: projectLoading,
    error,
    refreshProjects,
  } = useProject();
  const [minimized, setMinimized] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleRefreshProjects = () => {
    console.log("Manual project refresh triggered via ProjectDebug");
    refreshProjects();
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full px-3 py-1 shadow"
          onClick={() => setMinimized(false)}
          aria-label="Expand Project Debug"
        >
          &#9654; {/* Right-pointing triangle */}
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded p-4 shadow-lg text-xs max-w-sm z-50 overflow-auto max-h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Debug Info</h3>
        <div className="flex gap-1">
          <Button
            onClick={handleRefreshProjects}
            size="sm"
            variant="outline"
            className="h-8 px-2"
            disabled={projectLoading}
          >
            {projectLoading ? (
              <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            ) : (
              "Refresh"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            onClick={() => setMinimized(true)}
            aria-label="Minimize Project Debug"
          >
            &#8211; {/* En dash as minimize icon */}
          </Button>
        </div>
      </div>

      <div className="space-y-1 text-left">
        <div className="grid grid-cols-2 gap-1">
          <span className="font-medium">Auth Status:</span>
          <span className={authLoading ? "text-amber-500" : "text-green-500"}>
            {authLoading ? "Loading..." : "Ready"}
          </span>

          <span className="font-medium">User ID:</span>
          <span className="font-mono text-[10px] truncate">
            {user?.id || "None"}
          </span>

          <span className="font-medium">Project Status:</span>
          <span
            className={projectLoading ? "text-amber-500" : "text-green-500"}
          >
            {projectLoading ? "Loading..." : "Ready"}
          </span>

          <span className="font-medium">Projects Count:</span>
          <span>{projects.length}</span>

          <span className="font-medium">Current Project:</span>
          <span className="truncate" title={currentProject?.name || "None"}>
            {currentProject?.name || "None"}
          </span>

          <span className="font-medium">Project ID:</span>
          <span
            className="font-mono text-[10px] truncate"
            title={currentProject?.id || "None"}
          >
            {currentProject?.id || "None"}
          </span>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 whitespace-normal break-words">
            Error: {error}
          </div>
        )}

        {user && (
          <div className="mt-2">
            <div className="font-medium mb-1">User Details:</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded text-[10px]">
              <div>Email: {user.email || "N/A"}</div>
              <div>Role: {user.user_metadata?.role || "N/A"}</div>
              <div>
                Last Sign In:{" "}
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
