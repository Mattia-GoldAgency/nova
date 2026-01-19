import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailRaw = (body?.email ?? "").toString();
    const email = emailRaw.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Email non valida" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("waitlist").insert([{ email }]);

    // Se email già presente (unique), non trattiamolo come errore "grave"
    if (error) {
      const msg = (error as any).message?.toString() ?? "Errore";
      if (msg.toLowerCase().includes("duplicate")) {
        return NextResponse.json({ ok: true, already: true });
      }
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Errore imprevisto" }, { status: 500 });
  }
}
