import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useProject } from "@/contexts/ProjectContext";
import { getProjectStats, ProjectStat } from "@/utils/project-data-utils";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Displays analytics for the current project or all projects
 */
const ProjectAnalytics: React.FC = () => {
  const { currentProject, projects } = useProject();
  const [loading, setLoading] = useState(true);
  const [projectStats, setProjectStats] = useState<ProjectStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectStatistics() {
      try {
        setLoading(true);
        setError(null);

        let statsData: ProjectStat[] = [];

        // If we have a currentProject, get detailed stats just for it
        if (currentProject) {
          const singleStats = await getProjectStats(currentProject.id);
          if (singleStats) {
            statsData = [singleStats];
          }
        }
        // Otherwise get stats for all projects (limit to 10 for performance)
        else {
          const projectsToFetch = projects.slice(0, 10);
          const statsPromises = projectsToFetch.map((project) =>
            getProjectStats(project.id)
          );

          const results = await Promise.all(statsPromises);
          statsData = results.filter(Boolean) as ProjectStat[];
        }

        setProjectStats(statsData);
      } catch (err) {
        console.error("Error fetching project statistics:", err);
        setError("Failed to load project analytics");
      } finally {
        setLoading(false);
      }
    }

    if (projects.length > 0) {
      fetchProjectStatistics();
    } else {
      setLoading(false);
      setProjectStats([]);
    }
  }, [currentProject, projects]);

  // Transform data for charts
  const assetChartData = projectStats.map((stat) => ({
    name:
      stat.name.length > 15 ? `${stat.name.substring(0, 15)}...` : stat.name,
    assets: stat.asset_count || 0,
    workOrders: stat.work_order_count || 0,
    users: stat.user_count || 0,
  }));

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading project analytics...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <div className="text-red-500 text-center">
            <p className="font-semibold">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (projectStats.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <div className="text-center">
            <p className="text-muted-foreground">No project data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Analytics</CardTitle>
            <CardDescription>
              {currentProject
                ? `Metrics for ${currentProject.name}`
                : "Top project metrics"}
            </CardDescription>
          </div>
          {currentProject && (
            <Badge variant="outline" className="ml-2">
              {currentProject.project_code}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={assetChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assets" fill="#3b82f6" name="Assets" />
                <Bar dataKey="workOrders" fill="#10b981" name="Work Orders" />
                <Bar dataKey="users" fill="#8b5cf6" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resource allocation table */}
          <div className="mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium">Project</th>
                  <th className="text-right font-medium">Assets</th>
                  <th className="text-right font-medium">Work Orders</th>
                  <th className="text-right font-medium">Users</th>
                </tr>
              </thead>
              <tbody>
                {projectStats.map((stat) => (
                  <tr key={stat.id} className="border-t">
                    <td className="py-2">{stat.name}</td>
                    <td className="py-2 text-right">{stat.asset_count || 0}</td>
                    <td className="py-2 text-right">
                      {stat.work_order_count || 0}
                    </td>
                    <td className="py-2 text-right">{stat.user_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectAnalytics;
