// Types for admin related functionality

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  user_type_id?: string;
}

export interface UserType {
  id: string;
  name: string;
  description?: string;
}

// Project from the e_project table
export interface Project {
  id: number; // Using number for int8 data type
  name: string; // For UI display purposes
  project_name: string | null;
  project_code: string;
  description?: string | null;
  project_purpose?: string | null;
  short_name?: string | null;
}

// UserProject represents the user_projects table
export interface UserProject {
  id: string;
  user_id: string;
  project_id: number; // Using number for int8 data type
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Joined query result with the related user and project information
export interface UserProjectWithRelations extends UserProject {
  project: Project;
  user: User;
}
