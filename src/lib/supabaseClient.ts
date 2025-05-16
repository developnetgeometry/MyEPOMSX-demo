import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tkkvtfrpujxkznatclpq.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra3Z0ZnJwdWp4a3puYXRjbHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjg2NzksImV4cCI6MjA1ODcwNDY3OX0.YwcLnLWpA3FzZkyQs3tZ1emQM1VBNd3fnsZV4tSmUWc";
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
