import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const isLogin = pathname === "/login" || pathname.startsWith("/login/");
  const isOnboarding = pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (!isLogin && !isOnboarding && !isDashboard) {
    return NextResponse.next();
  }

  const { supabase, res } = createSupabaseServerClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isLogin) return res;
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  const onboarded = !error && profile?.onboarding_completed === true;

  if (isLogin) {
    url.pathname = onboarded ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(url);
  }

  if (isOnboarding && onboarded) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isDashboard && !onboarded) {
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/login/:path*", "/onboarding/:path*", "/dashboard/:path*"],
};

