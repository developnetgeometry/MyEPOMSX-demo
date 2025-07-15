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

interface WorkCenter {
  id: number;
  name: string;
}

const UserRegistration: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    userTypeId: "",
    employeeId: "",
    workCenterCode: "",
  });

  const [showEmployeeFields, setShowEmployeeFields] = useState(false);

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

    const fetchWorkCenters = async () => {
      try {
        const { data, error } = await supabase
          .from("e_work_center")
          .select("id, name");
        if (error) throw error;
        setWorkCenters(data || []);
      } catch (error: any) {
        console.error("Error fetching work centers:", error);
      }
    };

    fetchUserTypes();
    fetchWorkCenters();
  }, []);

  // Determine if we should show employee fields
  useEffect(() => {
    if (!formData.userTypeId) {
      setShowEmployeeFields(false);
      return;
    }

    const userType = userTypes.find(type => type.id === formData.userTypeId);
    const shouldShow = userType && 
      (userType.name.toLowerCase() === "engineer" || 
       userType.name.toLowerCase() === "technician");
    
    setShowEmployeeFields(!!shouldShow);
  }, [formData.userTypeId, userTypes]);

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

    // Employee field validation
    if (showEmployeeFields && !formData.employeeId) {
      toast({
        title: "Missing employee ID",
        description: "Employee ID is required for this user type.",
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

      // Create employee record if needed
      if (showEmployeeFields) {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;

        // Get the newly created user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.email)
          .single();

        if (profileError || !profileData) {
          throw new Error(`Failed to fetch user profile: ${profileError?.message}`);
        }

        const { error: empError } = await supabase
          .from("e_employee")
          .insert({
            uid_employee: formData.employeeId,
            name: formData.fullName,  // Set name from form data
            profile_id: profileData.id,  // Link to profile
            work_center_code: formData.workCenterCode 
              ? parseInt(formData.workCenterCode) 
              : null,
            created_by: currentUserId
          });

        if (empError) {
          throw new Error(`Employee record creation failed: ${empError.message}`);
        }
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
        description: `User ${formData.fullName} has been created with ${userTypeData.name} role.`,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        userTypeId: "",
        employeeId: "",
        workCenterCode: "",
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
      } else if (errorMessage.includes("Employee record creation failed")) {
        errorMessage += " User was created but employee record failed.";
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

  // ... (handleVerifyDatabase function remains the same) ...

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

              {/* Employee Fields */}
              {showEmployeeFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">
                      Employee ID<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employeeId"
                      placeholder="Enter employee ID"
                      value={formData.employeeId}
                      onChange={(e) => handleChange("employeeId", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workCenterCode">Work Center</Label>
                    <Select
                      value={formData.workCenterCode}
                      onValueChange={(value) => handleChange("workCenterCode", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select work center" />
                      </SelectTrigger>
                      <SelectContent>
                        {workCenters.map((center) => (
                          <SelectItem 
                            key={center.id} 
                            value={center.id.toString()}
                          >
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
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
      </CardContent>
    </Card>
  );
};

export default UserRegistration;