import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log("Sign out button clicked");

    try {
      const { error } = await signOut();

      if (error) {
        console.error("Sign out error:", error);
      } else {
        console.log("Sign out successful, redirecting to /auth");
      }

      // Always redirect to auth page regardless of errors
      // since we clear local state in signOut function
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Unexpected sign out error:", error);
      // Still redirect even if there's an unexpected error
      navigate("/auth", { replace: true });
    }
  };

  if (!user || !profile) {
    return null;
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profile.avatar_url || ""}
              alt={profile.full_name || ""}
            />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">
              {profile.full_name || "No name set"}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Member since
            </label>
            <p className="text-sm">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Last updated
            </label>
            <p className="text-sm">
              {new Date(profile.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Button onClick={handleSignOut} variant="outline" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
