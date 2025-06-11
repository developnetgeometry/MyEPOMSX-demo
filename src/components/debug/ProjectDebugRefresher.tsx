import React, { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const ProjectDebugRefresher: React.FC = () => {
  const {
    currentProject,
    projects,
    loading: projectLoading,
    error,
    refreshProjects,
  } = useProject();
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleRefreshProjects = async () => {
    try {
      setRefreshCount((prev) => prev + 1);
      setLastRefreshed(new Date().toISOString());
      console.log("Manual project refresh triggered via ProjectDebugRefresher");
      await refreshProjects();
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full px-3 py-1 shadow"
          onClick={() => setMinimized(false)}
          aria-label="Expand Project Debug Refresher"
        >
          &#9654; {/* Right-pointing triangle */}
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded p-4 shadow-lg text-xs max-w-sm z-50 overflow-auto max-h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Project Status Monitor</h3>
        <div className="flex gap-1">
          <Button
            onClick={handleRefreshProjects}
            size="sm"
            variant="outline"
            className="h-8 px-2"
            disabled={projectLoading}
          >
            {projectLoading ? (
              <a className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            onClick={() => setMinimized(true)}
            aria-label="Minimize Project Debug Refresher"
          >
            &#8211; {/* En dash as minimize icon */}
          </Button>
        </div>
      </div>

      <div className="space-y-1 text-left">
        <div className="grid grid-cols-2 gap-1">
          <span className="font-medium">Status:</span>
          <span
            className={projectLoading ? "text-amber-500" : "text-green-500"}
          >
            {projectLoading ? "Loading..." : "Ready"}
          </span>

          <span className="font-medium">Current Project:</span>
          <span>{currentProject?.name || "None"}</span>

          <span className="font-medium">Project ID:</span>
          <span className="font-mono text-[10px]">
            {currentProject?.id || "None"}
          </span>

          <span className="font-medium">Projects Count:</span>
          <span>{projects.length}</span>

          <span className="font-medium">Refresh Count:</span>
          <span>{refreshCount}</span>
        </div>

        {lastRefreshed && (
          <div className="text-[10px] text-gray-500 mt-1">
            Last refreshed: {new Date(lastRefreshed).toLocaleTimeString()}
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 whitespace-normal break-words">
            Error: {error}
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-2">
            <div className="font-medium mb-1">Available Projects:</div>
            <div className="max-h-[100px] overflow-y-auto border border-gray-200 rounded p-1">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`text-[10px] p-1 rounded ${
                    currentProject?.id === project.id ? "bg-blue-100" : ""
                  }`}
                >
                  {project.name}{" "}
                  <span className="text-gray-500">
                    ({project.project_code})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectDebugRefresher;
