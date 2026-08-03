import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types";
const fail = (error: Error | null) => { if (error) throw error; };
export const notificationsService = { async list(): Promise<Notification[]> { const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20); fail(error); return data ?? []; }, async markRead(id: string) { const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id); fail(error); } };
