import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import Overview from "./Overview";
import UserProfile from "@/components/auth/UserProfile";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const { currentProject } = useProject();

  console.log(
    `Loading data for project: ${currentProject.name} (ID: ${currentProject.id})`
  );

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is authenticated, show the main dashboard with overview and user profile
  if (user) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Overview />
        </div>
      </div>
    );
  }

  // This should not happen due to ProtectedRoute, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Index;
