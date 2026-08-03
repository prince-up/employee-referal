import { supabase } from "@/lib/supabase";

const ensure = <T,>(error: Error | null, value: T) => { if (error) throw error; return value; };
export const authService = {
  async signIn(email: string, password: string) { const { data, error } = await supabase.auth.signInWithPassword({ email, password }); return ensure(error, data); },
  async signUp(email: string, password: string, metadata: { full_name: string }) { const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } }); return ensure(error, data); },
  async signOut() { const { error } = await supabase.auth.signOut(); ensure(error, undefined); },
  async getSession() { const { data, error } = await supabase.auth.getSession(); return ensure(error, data.session); },
  async resetPassword(email: string) { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` }); ensure(error, undefined); },
};
