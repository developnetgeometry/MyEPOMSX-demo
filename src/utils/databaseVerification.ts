/**
 * Database Verification Script for EPOMSX User Management
 *
 * This script helps verify that your Supabase database is properly configured
 * for user registration and management.
 */

import { supabase } from "@/lib/supabaseClient";

interface DatabaseCheckResult {
  check: string;
  status: "pass" | "fail" | "warning";
  message: string;
  details?: any;
}

export class DatabaseVerification {
  /**
   * Quick verification after running setup script
   */
  static async quickVerification(): Promise<void> {
    console.log("🔍 Quick Database Verification for EPOMSX\n");

    try {
      // Check user_type table
      const { data: userTypes, error: userTypeError } = await supabase
        .from("user_type")
        .select("*");

      if (userTypeError) {
        console.error("❌ user_type table not found:", userTypeError.message);
        console.log(
          "🚨 Please run the setup_database.sql script in Supabase SQL Editor"
        );
        return;
      }

      console.log("✅ user_type table exists with", userTypes?.length, "types");
      console.log("   Types:", userTypes?.map((t) => t.name).join(", "));

      // Check profiles table structure
      const { error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

      if (profilesError) {
        console.error("❌ profiles table not found:", profilesError.message);
        console.log(
          "🚨 Please run the setup_database.sql script in Supabase SQL Editor"
        );
        return;
      }

      console.log("✅ profiles table exists and is accessible");

      // Check if we can fetch user types (what the registration form does)
      const { data: formUserTypes, error: formError } = await supabase
        .from("user_type")
        .select("id, name")
        .eq("is_active", true);

      if (formError) {
        console.error(
          "❌ Cannot fetch user types for form:",
          formError.message
        );
        return;
      }

      console.log("✅ User registration form can fetch user types");
      console.log("🎉 Database setup appears to be working correctly!");
    } catch (error) {
      console.error("❌ Verification failed:", error);
      console.log(
        "🚨 Please run the setup_database.sql script in Supabase SQL Editor"
      );
    }
  }

  /**
   * Run all database verification checks
   */
  static async runAllChecks(): Promise<DatabaseCheckResult[]> {
    const results: DatabaseCheckResult[] = [];

    console.log("🔍 Starting database verification...\n");

    // Check 1: User Type table exists and has data
    results.push(await this.checkUserTypeTable());

    // Check 2: Profiles table exists
    results.push(await this.checkProfilesTable());

    // Check 3: Check RLS policies
    results.push(await this.checkRLSPolicies());

    // Check 4: Test user type fetch (what the form does)
    results.push(await this.checkUserTypeFetch());

    // Check 5: Check triggers
    results.push(await this.checkTriggers());

    return results;
  }

  /**
   * Check if user_type table exists and has default data
   */
  private static async checkUserTypeTable(): Promise<DatabaseCheckResult> {
    try {
      const { data, error } = await supabase
        .from("user_type")
        .select("*")
        .order("name");

      if (error) {
        return {
          check: "User Type Table",
          status: "fail",
          message: `Error accessing user_type table: ${error.message}`,
          details: error,
        };
      }

      if (!data || data.length === 0) {
        return {
          check: "User Type Table",
          status: "warning",
          message:
            "user_type table exists but has no data. Please insert default user types.",
          details: data,
        };
      }

      const expectedTypes = [
        "Admin",
        "Manager",
        "Engineer",
        "Operator",
        "Viewer",
      ];
      const existingTypes = data.map((t) => t.name);
      const missingTypes = expectedTypes.filter(
        (t) => !existingTypes.includes(t)
      );

      if (missingTypes.length > 0) {
        return {
          check: "User Type Table",
          status: "warning",
          message: `user_type table exists but missing some default types: ${missingTypes.join(
            ", "
          )}`,
          details: { existing: existingTypes, missing: missingTypes },
        };
      }

      return {
        check: "User Type Table",
        status: "pass",
        message: `user_type table configured correctly with ${data.length} types`,
        details: data,
      };
    } catch (error: any) {
      return {
        check: "User Type Table",
        status: "fail",
        message: `Exception checking user_type table: ${error.message}`,
        details: error,
      };
    }
  }

  /**
   * Check if profiles table exists and is accessible
   */
  private static async checkProfilesTable(): Promise<DatabaseCheckResult> {
    try {
      // Try to query the profiles table structure
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

      if (error) {
        return {
          check: "Profiles Table",
          status: "fail",
          message: `Error accessing profiles table: ${error.message}`,
          details: error,
        };
      }

      return {
        check: "Profiles Table",
        status: "pass",
        message: "profiles table exists and is accessible",
        details: { recordCount: data?.length || 0 },
      };
    } catch (error: any) {
      return {
        check: "Profiles Table",
        status: "fail",
        message: `Exception checking profiles table: ${error.message}`,
        details: error,
      };
    }
  }

  /**
   * Check RLS policies
   */
  private static async checkRLSPolicies(): Promise<DatabaseCheckResult> {
    try {
      // This is a basic check - in a real scenario you'd need service role access
      // to check pg_policies table
      const { data, error } = await supabase
        .from("user_type")
        .select("id")
        .limit(1);

      if (error && error.message.includes("row-level security")) {
        return {
          check: "RLS Policies",
          status: "fail",
          message:
            "RLS policies may be blocking access. Check policy configuration.",
          details: error,
        };
      }

      return {
        check: "RLS Policies",
        status: "pass",
        message: "RLS policies appear to be configured correctly",
        details: null,
      };
    } catch (error: any) {
      return {
        check: "RLS Policies",
        status: "warning",
        message: `Could not verify RLS policies: ${error.message}`,
        details: error,
      };
    }
  }

  /**
   * Test the exact query the form uses
   */
  private static async checkUserTypeFetch(): Promise<DatabaseCheckResult> {
    try {
      // This mimics the exact query in UserRegistration.tsx
      const { data, error } = await supabase
        .from("user_type")
        .select("*")
        .order("name");

      if (error) {
        return {
          check: "User Type Fetch (Form Query)",
          status: "fail",
          message: `Form query failed: ${error.message}`,
          details: error,
        };
      }

      if (!data || data.length === 0) {
        return {
          check: "User Type Fetch (Form Query)",
          status: "fail",
          message:
            "Form query returned no user types. Users cannot select a role.",
          details: data,
        };
      }

      return {
        check: "User Type Fetch (Form Query)",
        status: "pass",
        message: `Form query successful - ${data.length} user types available`,
        details: data.map((t) => ({ id: t.id, name: t.name })),
      };
    } catch (error: any) {
      return {
        check: "User Type Fetch (Form Query)",
        status: "fail",
        message: `Exception in form query: ${error.message}`,
        details: error,
      };
    }
  }

  /**
   * Check if triggers are working
   */
  private static async checkTriggers(): Promise<DatabaseCheckResult> {
    // This is harder to check without actually creating a user
    // For now, we'll just return a warning to manually verify
    return {
      check: "Database Triggers",
      status: "warning",
      message:
        "Trigger verification requires manual testing. Try creating a test user to verify automatic profile creation.",
      details: {
        note: "The handle_new_user() trigger should automatically create a profile when a user signs up.",
      },
    };
  }

  /**
   * Print results in a formatted way
   */
  static printResults(results: DatabaseCheckResult[]) {
    console.log("\n📊 Database Verification Results");
    console.log("================================\n");

    let passCount = 0;
    let failCount = 0;
    let warningCount = 0;

    results.forEach((result) => {
      const icon =
        result.status === "pass"
          ? "✅"
          : result.status === "fail"
          ? "❌"
          : "⚠️";
      console.log(`${icon} ${result.check}: ${result.message}`);

      if (result.details && Object.keys(result.details).length > 0) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
      console.log("");

      if (result.status === "pass") passCount++;
      else if (result.status === "fail") failCount++;
      else warningCount++;
    });

    console.log(
      `Summary: ${passCount} passed, ${warningCount} warnings, ${failCount} failed\n`
    );

    if (failCount > 0) {
      console.log("🚨 Action Required:");
      console.log(
        "1. Run the setup_database.sql script in your Supabase SQL Editor"
      );
      console.log("2. Check your Supabase project settings");
      console.log("3. Verify your RLS policies are correctly configured\n");
    } else if (warningCount > 0) {
      console.log("⚠️ Some issues found but registration might still work.");
      console.log(
        "Consider addressing the warnings for optimal functionality.\n"
      );
    } else {
      console.log(
        "🎉 All checks passed! Your database should be ready for user registration.\n"
      );
    }
  }

  /**
   * Quick fix suggestions
   */
  static getQuickFixes(): string[] {
    return [
      "Run the setup_database.sql script in Supabase SQL Editor",
      "Ensure your Supabase project has auth enabled",
      "Check that email confirmation is properly configured",
      "Verify your service role key has proper permissions",
      "Make sure RLS policies allow authenticated users to read user_type table",
      "Check Supabase logs for more detailed error messages",
    ];
  }
}

/**
 * Quick verification function for immediate testing
 */
export async function quickVerifyDatabase() {
  console.log("🔍 Quick Database Verification Starting...\n");

  // Check 1: User Type Table
  try {
    const { data: userTypes, error: userTypeError } = await supabase
      .from("user_type")
      .select("*");

    if (userTypeError) {
      console.error(
        "❌ user_type table missing or inaccessible:",
        userTypeError.message
      );
      return false;
    }

    console.log(
      `✅ user_type table exists with ${userTypes?.length || 0} entries`
    );
    if (userTypes) {
      console.log(
        "   Available user types:",
        userTypes.map((ut) => ut.name).join(", ")
      );
    }
  } catch (error: any) {
    console.error("❌ Critical error checking user_type table:", error.message);
    return false;
  }

  // Check 2: Profiles Table
  try {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);

    if (profileError) {
      console.error(
        "❌ profiles table missing or inaccessible:",
        profileError.message
      );
      return false;
    }

    console.log("✅ profiles table exists and accessible");
  } catch (error: any) {
    console.error("❌ Critical error checking profiles table:", error.message);
    return false;
  }

  // Check 3: Check for triggers (indirect test)
  try {
    const { data: triggerTest } = await supabase.rpc("get_user_role");
    console.log("✅ Database functions are working");
  } catch (error: any) {
    console.warn("⚠️  Database functions may not be set up:", error.message);
  }

  console.log(
    "\n🎯 Verification complete. If you see errors above, run the setup_database.sql script!\n"
  );
  return true;
}

/**
 * Export a simple function to run the verification
 */
export async function verifyDatabase() {
  const results = await DatabaseVerification.runAllChecks();
  DatabaseVerification.printResults(results);

  console.log("🔧 Quick Fix Suggestions:");
  DatabaseVerification.getQuickFixes().forEach((fix, index) => {
    console.log(`${index + 1}. ${fix}`);
  });

  return results;
}

export default DatabaseVerification;
