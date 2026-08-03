import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AuthState, User } from "@/types";
import { authService } from "@/services/auth.service";
import { supabase } from "@/lib/supabase";

interface AuthContextType extends AuthState { login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; updateUser: (user: Partial<User>) => Promise<void>; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);
async function toAppUser(id: string, email = ""): Promise<User> {
  const { data, error } = await supabase.from("profiles").select("id, email, full_name, role, avatar_url, employee_id").eq("id", id).single();
  if (error) throw error;
  return { id: data.id, email: data.email || email, name: data.full_name, role: data.role, avatar: data.avatar_url ?? undefined, employee_id: data.employee_id ?? undefined };
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, isAuthenticated: false, isLoading: true });
  const hydrate = useCallback(async (session: Awaited<ReturnType<typeof authService.getSession>>) => {
    if (!session) { setState({ user: null, token: null, isAuthenticated: false, isLoading: false }); return; }
    try { const user = await toAppUser(session.user.id, session.user.email); setState({ user, token: session.access_token, isAuthenticated: true, isLoading: false }); }
    catch { setState({ user: null, token: null, isAuthenticated: false, isLoading: false }); }
  }, []);
  useEffect(() => { authService.getSession().then(hydrate).catch(() => setState((s) => ({ ...s, isLoading: false }))); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { void hydrate(session); }); return () => subscription.unsubscribe(); }, [hydrate]);
  const login = useCallback(async (email: string, password: string) => { const data = await authService.signIn(email, password); await hydrate(data.session); }, [hydrate]);
  const logout = useCallback(async () => { await authService.signOut(); }, []);
  const updateUser = useCallback(async (updates: Partial<User>) => { if (!state.user) return; const { error } = await supabase.from("profiles").update({ full_name: updates.name, avatar_url: updates.avatar }).eq("id", state.user.id); if (error) throw error; setState((current) => current.user ? { ...current, user: { ...current.user, ...updates } } : current); }, [state.user]);
  return <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used within AuthProvider"); return ctx; }
