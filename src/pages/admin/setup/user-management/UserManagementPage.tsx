import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import UserRegistration from "./UserRegistration";
import UserList from "./UserList";
import ProjectAssignment from "./ProjectAssignment";

const UserManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("user-list");

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        icon={<Users className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="user-list">User List</TabsTrigger>
              <TabsTrigger value="user-registration">Register User</TabsTrigger>
              <TabsTrigger value="project-assignment">
                Project Assignment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user-list">
              <UserList />
            </TabsContent>

            <TabsContent value="user-registration">
              <UserRegistration />
            </TabsContent>

            <TabsContent value="project-assignment">
              <ProjectAssignment />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;
