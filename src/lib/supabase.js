// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qypmtvknperwoyqdfupn.supabase.co"; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cG10dmtucGVyd295cWRmdXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyNDE1OTEsImV4cCI6MjAyMzgxNzU5MX0.5woPntIruC1WMkz4Ssff74QhbBOz7l-Vg5vIkLGbRwQ"; // Replace with your Supabase anonymous key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };
