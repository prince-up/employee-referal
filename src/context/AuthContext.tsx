import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AuthState, User } from "@/types";
import { authService } from "@/services/auth.service";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType extends AuthState { login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; updateUser: (user: Partial<User>) => Promise<void>; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth must remain usable before the optional HR schema migration is applied.
// Roles always default to employee here; privileged roles are supplied only by the
// RLS-protected profiles table once the migration has been deployed.
async function toAppUser(session: Session): Promise<User> {
  const metadata = session.user.user_metadata ?? {};
  const fallback: User = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: typeof metadata.full_name === "string" ? metadata.full_name : session.user.email?.split("@")[0] ?? "User",
    avatar: typeof metadata.avatar_url === "string" ? metadata.avatar_url : undefined,
    role: "employee",
  };
  const { data, error } = await supabase.from("profiles").select("email, full_name, role, avatar_url, employee_id").eq("id", session.user.id).maybeSingle();
  if (error || !data) return fallback;
  return { id: session.user.id, email: data.email || fallback.email, name: data.full_name || fallback.name, role: data.role, avatar: data.avatar_url ?? undefined, employee_id: data.employee_id ?? undefined };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, isAuthenticated: false, isLoading: true });
  const hydrate = useCallback(async (session: Session | null) => {
    if (!session) { setState({ user: null, token: null, isAuthenticated: false, isLoading: false }); return; }
    const user = await toAppUser(session);
    setState({ user, token: session.access_token, isAuthenticated: true, isLoading: false });
  }, []);
  useEffect(() => { authService.getSession().then(hydrate).catch(() => setState((s) => ({ ...s, isLoading: false }))); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { void hydrate(session); }); return () => subscription.unsubscribe(); }, [hydrate]);
  const login = useCallback(async (email: string, password: string) => { const data = await authService.signIn(email, password); await hydrate(data.session); }, [hydrate]);
  const logout = useCallback(async () => { await authService.signOut(); }, []);
  const updateUser = useCallback(async (updates: Partial<User>) => {
    const { error } = await supabase.auth.updateUser({ data: { full_name: updates.name, avatar_url: updates.avatar } });
    if (error) throw error;
    setState((current) => current.user ? { ...current, user: { ...current.user, ...updates } } : current);
  }, []);
  return <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used within AuthProvider"); return ctx; }
