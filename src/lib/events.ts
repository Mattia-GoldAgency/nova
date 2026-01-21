import { supabase } from "@/lib/supabaseClient";

export type EventType =
  | "login_success"
  | "onboarding_completed"
  | "session_start_clicked"

  // Dashboard CTAs (aggiunti per evitare blocchi build)
  | "cta_start_conversation_clicked"
  | "cta_journal_clicked"
  | "cta_task_clicked"

  // Legacy / altre CTAs
  | "assiassistant_cta_clicked" // legacy/typo mantenuto
  | "assistant_cta_clicked" // variante corretta
  | "companion_cta_clicked"

  // Session / messaging
  | "session_created"
  | "sessione_mode_selected" // legacy/typo mantenuto
  | "session_mode_selected" // variante corretta
  | "message_sent";

export type AppEvent = {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, any>;
  created_at: string;
};

export async function logEvent(type: EventType, payload: Record<string, any> = {}) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return;

  const { error } = await supabase.from("events").insert({
    user_id: user.id,
    type,
    payload,
  });

  if (error) console.error("logEvent error:", error.message);
}

export async function getRecentEvents(limit = 5): Promise<AppEvent[]> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return [];

  const { data: events, error } = await supabase
    .from("events")
    .select("id, user_id, type, payload, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentEvents error:", error.message);
    return [];
  }

  return (events ?? []) as AppEvent[];
}
