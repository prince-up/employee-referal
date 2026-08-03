import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn("Supabase is not configured. Copy .env.example to .env and supply your project credentials.");
}

// Database is intentionally checked at the service boundary; keeping this client permissive
// lets the app compile before `supabase gen types` is run against the user's project.
export const supabase = createClient<any>(url ?? "https://placeholder.supabase.co", anonKey ?? "placeholder", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
