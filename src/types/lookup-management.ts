// Additional types for custom database functions used in Lookup Management

import { SupabaseClient } from "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  interface SupabaseClient {
    rpc<T = any>(
      fn:
        | "get_table_columns"
        | "direct_query"
        | "assign_user_to_project"
        | "get_project_assigned_users"
        | "get_user_assigned_projects"
        | "get_users_for_project_assignment"
        | "get_users_with_details"
        | "remove_user_from_project",
      params?: { [key: string]: any },
      options?: {
        count?: null | "exact" | "planned" | "estimated";
        head?: boolean;
      }
    ): Promise<{ data: T; error: null } | { data: null; error: any }>;
  }
}

export interface UserTypeDetails {
  id: number;
  name: string;
}

// Extend the existing Profile interface with additional properties
export interface ExtendedProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  user_type_id: number | null;
  status: string | null;
  is_active: boolean | null;
}

// Type for column metadata returned by get_table_columns function
export interface ColumnMetadataResult {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
}

// Type for direct_query results can vary based on the query
export type DirectQueryResult = any;
