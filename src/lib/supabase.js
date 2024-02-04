// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://unzrytzqvkfnveimnfot.supabase.co"; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuenJ5dHpxdmtmbnZlaW1uZm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3ODg4NjQsImV4cCI6MjAyMjM2NDg2NH0.cSwu_FTdL8cwLRbq4Q3HdCJ4J3L9E0SP0lf28IKijGo"; // Replace with your Supabase anonymous key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };
