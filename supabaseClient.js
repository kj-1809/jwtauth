import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
	"https://hfmcfnytuxybkuwwjqjq.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbWNmbnl0dXh5Ymt1d3dqcWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExNDEzNTgsImV4cCI6MTk5NjcxNzM1OH0.9Uwxsr0N-YNLUkOHn807Qv8dyrin3K7XNKwmbbzI8LE"
);

export { supabase };
