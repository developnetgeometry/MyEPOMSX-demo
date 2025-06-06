// Types for profile related functionality

import { UserType } from "./admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type_id: string;
  user_type: UserType;
  created_at: string;
  updated_at?: string;
  is_active: boolean;
  is_deleted: boolean;
  avatar_url?: string;
}

export interface ProjectAssignment {
  id: string;
  project_id: number;
  project_name?: string;
  project_code?: string;
  created_at: string;
}

export interface UserWithDetails extends Profile {
  project_assignments?: ProjectAssignment[];
}
