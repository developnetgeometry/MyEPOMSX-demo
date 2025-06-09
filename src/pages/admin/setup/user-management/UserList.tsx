import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/shared/DataTable";
import { Column } from "@/components/shared/DataTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye } from "lucide-react";
import { UserType } from "@/types/admin";
import { UserWithDetails, ProjectAssignment } from "@/types/profiles";

interface EditUserFormData {
  full_name: string;
  email: string;
  user_type_id: string;
  password?: string;
  is_active: boolean;
}

// Using any type to bypass TypeScript restrictions with Supabase client
// This is a temporary solution until proper database type definitions are implemented

const UserList: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<string>("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserWithDetails | null>(null);
  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    full_name: "",
    email: "",
    user_type_id: "",
    password: "",
    is_active: true,
  });

  // Profile view state
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(
    null
  );

  useEffect(() => {
    fetchUserTypes();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      filterUsers();
    }
  }, [searchQuery, selectedUserType, users]);

  const fetchUserTypes = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("user_type")
        .select("id, name, description")
        .order("name");

      if (error) throw error;
      setUserTypes((data as UserType[]) || []);
    } catch (error: any) {
      toast({
        title: "Error fetching user types",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Use the new optimized RPC function that includes project assignments and status fields
      const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
        "get_users_with_details"
      );

      if (!rpcError && rpcData) {
        setUsers(rpcData as UserWithDetails[]);
        setFilteredUsers(rpcData as UserWithDetails[]);
      } else {
        // Fallback to regular join if RPC not available
        console.warn(
          "Falling back to regular query - RPC not available:",
          rpcError
        );

        // Get user profiles with user types
        const { data, error } = await (supabase as any)
          .from("profiles")
          .select(
            `
            id, 
            email, 
            full_name, 
            created_at, 
            user_type_id,
            is_active,
            is_deleted,
            user_type:user_type_id (id, name, description)
          `
          )
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Transform the data to match the expected format from the RPC function
        const transformedData = (data || []).map((user: any) => ({
          ...user,
          // Explicitly format the user_type object to ensure it has the right structure
          user_type: user.user_type
            ? {
                id: user.user_type.id,
                name: user.user_type.name || "Unknown",
                description: user.user_type.description || null,
              }
            : null,
          // Add empty project assignments array if not present
          project_assignments: [],
        })) as UserWithDetails[];

        setUsers(transformedData);
        setFilteredUsers(transformedData);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
      // Set empty arrays to prevent undefined errors
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(lowerCaseQuery) ||
          user.email?.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Filter by user type
    if (selectedUserType && selectedUserType !== "all") {
      result = result.filter((user) => user.user_type_id === selectedUserType);
    }

    setFilteredUsers(result);
  };

  const handleEdit = (user: UserWithDetails) => {
    setUserToEdit(user);
    setEditFormData({
      full_name: user.full_name,
      email: user.email,
      user_type_id: user.user_type_id,
      password: "",
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      user_type_id: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    setIsLoading(true);
    try {
      // Update profile data
      const updates = {
        full_name: editFormData.full_name,
        email: editFormData.email,
        user_type_id: editFormData.user_type_id,
        is_active: editFormData.is_active,
        updated_at: new Date().toISOString(),
      };

      const { error } = await (supabase as any)
        .from("profiles")
        .update(updates)
        .eq("id", userToEdit.id);

      if (error) throw error;

      // If password is provided, update it
      if (editFormData.password) {
        // Note: Password reset needs to be done with Admin API or custom server function
        // This is a placeholder - actual implementation depends on your backend
        const { error: passwordError } = await (supabase as any).rpc(
          "admin_update_user_password",
          {
            user_id: userToEdit.id,
            new_password: editFormData.password,
          }
        );

        if (passwordError) {
          // Show password error but don't prevent other updates from being saved
          toast({
            title: "Password update failed",
            description: passwordError.message,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      });

      // Refresh user list
      fetchUsers();
      setIsEditDialogOpen(false);
      setUserToEdit(null);
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Use soft delete by setting is_deleted to true and is_active to false
      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          is_deleted: true,
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "User deleted",
        description: "The user has been marked as deleted in the system.",
      });

      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteUserId(null);
    }
  };

  const columns: Column[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "full_name",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "userType",
      header: "User Type",
      accessorKey: "user_type",
      cell: (value) => {
        console.log("User Type Value:", value.name);
        // Properly access the user type name from the joined data
        return value?.name || "-";
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "is_active",
      cell: (value) => {
        if (value.is_deleted) {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Deleted
            </span>
          );
        }
        console.log("User Status Value:", value);
        return value ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        );
      },
    },
    {
      id: "created_at",
      header: "Created At",
      accessorKey: "created_at",
      cell: (value) => {
        // Format the date properly
        try {
          console.log("Created At Value:", value);
          return format(new Date(value), "dd/MM/yyyy hh:mm a");
        } catch (e) {
          return "-";
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row)}
            title="Edit User"
          >
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedUser(row);
              setIsProfileViewOpen(true);
            }}
            title="View Profile"
          >
            <Eye className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteUserId(row.id)}
            title="Delete User"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="userTypeFilter" className="whitespace-nowrap">
                Filter by User Type:
              </Label>
              <Select
                value={selectedUserType}
                onValueChange={setSelectedUserType}
              >
                <SelectTrigger id="userTypeFilter" className="w-[180px]">
                  <SelectValue placeholder="All User Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All User Types</SelectItem>
                  {userTypes.map((userType) => (
                    <SelectItem key={userType.id} value={userType.id}>
                      {userType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            data={filteredUsers}
            columns={columns}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDelete(deleteUserId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and optionally set a new password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={editFormData.full_name}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_type_id">User Type</Label>
                <Select
                  value={editFormData.user_type_id}
                  onValueChange={handleUserTypeChange}
                >
                  <SelectTrigger id="user_type_id">
                    <SelectValue placeholder="Select User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((userType) => (
                      <SelectItem key={userType.id} value={userType.id}>
                        {userType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  New Password{" "}
                  <span className="text-gray-500 text-sm">
                    (leave blank to keep current)
                  </span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={editFormData.password}
                  onChange={handleEditFormChange}
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="user-active-status">User Active Status</Label>
                <Switch
                  id="user-active-status"
                  checked={editFormData.is_active}
                  onCheckedChange={(checked) =>
                    setEditFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <span className="text-sm text-gray-500">
                  {editFormData.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Profile View Dialog */}
      <Dialog open={isProfileViewOpen} onOpenChange={setIsProfileViewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              User details and project assignments
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">User Information</h3>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedUser.full_name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedUser.email}
                    </div>
                    <div>
                      <span className="font-medium">User Type:</span>{" "}
                      {selectedUser.user_type?.name || "-"}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {selectedUser.is_deleted ? (
                        <span className="text-red-600">Deleted</span>
                      ) : selectedUser.is_active ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-gray-600">Inactive</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {selectedUser.created_at
                        ? format(
                            new Date(selectedUser.created_at),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "-"}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {selectedUser.updated_at
                        ? format(
                            new Date(selectedUser.updated_at),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "-"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Project Assignments</h3>
                  {selectedUser.project_assignments &&
                  selectedUser.project_assignments.length > 0 ? (
                    <div className="space-y-3 mt-2 max-h-[300px] overflow-y-auto pr-2">
                      {selectedUser.project_assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="border rounded-md p-3"
                        >
                          <div className="font-medium">
                            {assignment.project_name ||
                              `Project ${assignment.project_id}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span>
                              Code: {assignment.project_code || "N/A"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Assigned:{" "}
                            {format(
                              new Date(assignment.created_at),
                              "dd/MM/yyyy"
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 mt-2">
                      No project assignments found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsProfileViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserList;
