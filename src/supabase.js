import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://euerfdfocvxinsoafkxw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXJmZGZvY3Z4aW5zb2Fma3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Nzc2MTgsImV4cCI6MjA5NTM1MzYxOH0.0UtlnzLqzySH-tUk4dQ8QTxVbbm4INKbqIJTgXpc4Ak";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);