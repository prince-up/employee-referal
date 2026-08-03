import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError = !url || !anonKey
  ? "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the development server."
  : null;

if (supabaseConfigError) console.warn(supabaseConfigError);

// Database is intentionally checked at the service boundary; keeping this client permissive
// lets the app compile before `supabase gen types` is run against the user's project.
export const supabase = createClient<any>(url ?? "https://placeholder.supabase.co", anonKey ?? "placeholder", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
