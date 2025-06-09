import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import Overview from "./Overview";
import UserProfile from "@/components/auth/UserProfile";
import { Loader2 } from "lucide-react";

const Index = () => {
  console.log("🏠 Index page component rendered");

  const { user, loading } = useAuth();
  const { currentProject } = useProject();

  console.log(
    "Index page - user:",
    !!user,
    "loading:",
    loading,
    "currentProject:",
    currentProject
  );

  // Only log if currentProject exists
  if (currentProject) {
    console.log(
      `Loading data for project: ${currentProject.name} (ID: ${currentProject.id})`
    );
  }

  // Show loading spinner while checking auth state
  if (loading) {
    console.log("Index page showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is authenticated, show the main dashboard with overview and user profile
  if (user) {
    console.log("Index page showing authenticated content");
    return (
      <div className="space-y-6">
        <Overview />
      </div>
    );
  }

  // This should not happen due to ProtectedRoute, but just in case
  console.log("Index page fallback loading");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Index;
