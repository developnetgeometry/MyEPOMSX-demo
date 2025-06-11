import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { DatabaseVerification } from "@/utils/databaseVerification";
import { createUserWithSessionPreservation } from "@/services/adminUserService";

interface UserType {
  id: string;
  name: string;
  description: string | null;
}

const UserRegistration: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    userTypeId: "",
  });

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const { data, error } = await supabase
          .from("user_type")
          .select("*")
          .order("name");
        if (error) throw error;
        setUserTypes(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching user types",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchUserTypes();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.email ||
      !formData.password ||
      !formData.fullName ||
      !formData.userTypeId
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user type exists
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_type")
        .select("id, name")
        .eq("id", formData.userTypeId)
        .single();

      if (userTypeError) {
        throw new Error(`Invalid user type selected: ${userTypeError.message}`);
      }

      // Use session-preserving user creation method
      const result = await createUserWithSessionPreservation({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userTypeId: formData.userTypeId,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create user");
      }

      // Verify current session is still intact
      const { data: sessionCheck } = await supabase.auth.getSession();
      if (!sessionCheck.session) {
        console.warn(
          "Session was lost during user creation, this should not happen"
        );
      }

      toast({
        title: "User registered successfully",
        description: `User ${formData.fullName} has been created with ${userTypeData.name} role. They can sign in immediately.`,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        userTypeId: "",
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "An unexpected error occurred during registration.";

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Provide more specific error messages
      if (errorMessage.includes("User already registered")) {
        errorMessage = "A user with this email address already exists.";
      } else if (errorMessage.includes("Database error saving new user")) {
        errorMessage =
          "Database configuration error. Please contact your system administrator.";
      } else if (errorMessage.includes("Invalid user type")) {
        errorMessage =
          "The selected user type is invalid. Please refresh the page and try again.";
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDatabase = async () => {
    setIsVerifying(true);
    try {
      await DatabaseVerification.quickVerification();
      toast({
        title: "Database verification complete",
        description:
          "Check the browser console for detailed results. If you see ✅ marks, your database is ready!",
      });
    } catch (error: any) {
      console.error("Database verification failed:", error);
      toast({
        title: "Database verification failed",
        description:
          "Please run the setup_database.sql script in Supabase SQL Editor. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter user's full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter user's email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">
                  User Type<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.userTypeId}
                  onValueChange={(value) => handleChange("userTypeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register User"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={handleVerifyDatabase}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Database Setup"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRegistration;
