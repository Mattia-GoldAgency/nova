import { supabase } from "@/lib/supabaseClient";

export type UserRole = "assistant" | "companion";

export async function getMyProfile() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) return { user: null, profile: null };

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, role, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  return { user, profile };
}
