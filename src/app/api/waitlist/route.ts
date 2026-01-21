import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const emailRaw = String(body?.email ?? "").trim();
    const email = emailRaw.toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Email non valida." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { ok: false, error: "Configurazione server mancante (Supabase)." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1) Check già presente
    const { data: existing, error: selErr } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (selErr) {
      console.error("waitlist select error:", selErr);
      return NextResponse.json({ ok: false, error: "Errore server. Riprova." }, { status: 500 });
    }

    if (existing?.email) {
      return NextResponse.json({ ok: true, already: true }, { status: 200 });
    }

    // 2) Insert nuovo
    const { error: insErr } = await supabase.from("waitlist").insert({ email });

    if (insErr) {
      console.error("waitlist insert error:", insErr);
      return NextResponse.json({ ok: false, error: "Errore salvataggio. Riprova." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, already: false }, { status: 200 });
  } catch (e: any) {
    console.error("waitlist route fatal:", e?.message ?? e);
    return NextResponse.json({ ok: false, error: "Errore server. Riprova." }, { status: 500 });
  }
}
