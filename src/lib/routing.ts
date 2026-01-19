import { getMyProfile } from "@/lib/profile";

export async function getPostLoginPath() {
  const { user, profile } = await getMyProfile();

  if (!user) return "/login";

  // se non esiste profilo -> onboarding
  if (!profile) return "/onboarding";

  // se onboarding non completato -> onboarding
  if (!profile.onboarding_completed) return "/onboarding";

  return "/dashboard";
}
