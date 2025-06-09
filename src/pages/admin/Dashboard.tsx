import React from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/layout/AdminLayout";
import ProjectAnalytics from "@/components/admin/ProjectAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Users, Briefcase, BarChart3 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

const AdminDashboard: React.FC = () => {
  const { currentProject } = useProject();
  const { profile } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Admin Dashboard"
          subtitle={`Welcome back, ${profile?.full_name || "Administrator"}`}
          icon={<BarChart3 className="h-6 w-6" />}
        />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-[600px] mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Briefcase className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Projects</CardTitle>
                  <CardDescription>Active project count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">4</div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: June 9, 2025
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Orders</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">27</div>
                  <div className="text-xs text-muted-foreground">
                    12 completed, 15 in progress
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Currently online</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">6</div>
                  <div className="text-xs text-muted-foreground">
                    From 18 total users
                  </div>
                </CardContent>
              </Card>
            </div>

            <ProjectAnalytics />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectAnalytics />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>Coming soon</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  User analytics dashboard is under development
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Events</CardTitle>
                <CardDescription>Coming soon</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Calendar integration is under development
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
