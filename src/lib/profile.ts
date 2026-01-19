import { supabase } from "@/lib/supabaseClient";

export type UserProfile = {
  id: string;
  onboarding_completed: boolean;
};

export async function getMyProfile(): Promise<{
  user: { id: string } | null;
  profile: UserProfile | null;
}> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const user = auth.user;
  if (!user) return { user: null, profile: null };

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  return {
    user: { id: user.id },
    profile: profile
      ? {
          id: profile.id,
          onboarding_completed: Boolean(profile.onboarding_completed),
        }
      : null,
  };
}


