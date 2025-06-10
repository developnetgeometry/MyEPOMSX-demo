import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

// Create a separate client for admin operations
// Note: You'll need to set up service role key in environment variables
const getAdminClient = () => {
  const supabaseUrl = "https://tkkvtfrpujxkznatclpq.supabase.co";
  const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Service role key not configured");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  userTypeId: string;
}

export interface CreateUserResponse {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Create a user using admin privileges without affecting current session
 */
export const createUserAsAdmin = async (
  userData: CreateUserRequest
): Promise<CreateUserResponse> => {
  try {
    // Method 1: Try using service role client (if configured)
    try {
      const adminClient = getAdminClient();

      const { data: authData, error: authError } =
        await adminClient.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          user_metadata: {
            full_name: userData.fullName,
            user_type_id: userData.userTypeId,
          },
          email_confirm: false, // Skip email confirmation for admin-created users
        });

      if (authError) throw authError;

      return {
        success: true,
        user: authData.user,
      };
    } catch (serviceRoleError) {
      console.warn(
        "Service role method failed, falling back to invitation method:",
        serviceRoleError
      );

      // Method 2: Fall back to invitation system
      return await createUserInvitation(userData);
    }
  } catch (error: any) {
    console.error("Admin user creation failed:", error);
    return {
      success: false,
      error: error.message || "Failed to create user",
    };
  }
};

/**
 * Alternative method: Create user invitation instead of direct creation
 */
export const createUserInvitation = async (
  userData: CreateUserRequest
): Promise<CreateUserResponse> => {
  try {
    const { data, error } = await supabase.rpc("create_user_invitation", {
      user_email: userData.email,
      user_full_name: userData.fullName,
      user_type_id: userData.userTypeId,
    });

    if (error) throw error;

    return {
      success: true,
      user: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create user invitation",
    };
  }
};

/**
 * Simple method: Create user with temporary session management
 */
export const createUserWithSessionPreservation = async (
  userData: CreateUserRequest
): Promise<CreateUserResponse> => {
  try {
    // Store current session
    const { data: currentSession } = await supabase.auth.getSession();

    // Create new user (this will change the session)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
          user_type_id: userData.userTypeId,
        },
        emailRedirectTo: undefined,
      },
    });

    if (authError) throw authError;

    // Immediately restore the original session
    if (currentSession.session) {
      await supabase.auth.setSession({
        access_token: currentSession.session.access_token,
        refresh_token: currentSession.session.refresh_token,
      });
    }

    return {
      success: true,
      user: authData.user,
    };
  } catch (error: any) {
    // Try to restore session even if user creation failed
    try {
      const { data: currentSession } = await supabase.auth.getSession();
      if (!currentSession.session) {
        // If no session, try to restore from localStorage or redirect to login
        window.location.href = "/auth";
      }
    } catch (restoreError) {
      console.error("Failed to restore session:", restoreError);
    }

    return {
      success: false,
      error: error.message || "Failed to create user",
    };
  }
};
