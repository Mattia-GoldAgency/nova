import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  // Se vuoi mostrare uno status semplice per debug/healthcheck
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { supabase, res } = createSupabaseServerClient(req as any);

    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    // TODO: qui devi usare la tua tabella reale (es. waitlist)
    // Esempio: public.waitlist(email text unique, created_at timestamptz default now())
    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      // se email unique e già presente, rispondiamo comunque ok (idempotente)
      const msg = (error as any)?.message?.toLowerCase?.() ?? "";
      const code = (error as any)?.code ?? "";

      const isDuplicate =
        code === "23505" || msg.includes("duplicate") || msg.includes("unique");

      if (isDuplicate) {
        return NextResponse.json({ ok: true, already: true }, { status: 200 });
      }

      return NextResponse.json({ error: "Errore salvataggio waitlist" }, { status: 500 });
    }

    // Importante: preserviamo eventuali cookie set dal client server Supabase
    return NextResponse.json({ ok: true }, { status: 200, headers: res.headers });
  } catch (e) {
    return NextResponse.json({ error: "Errore inatteso" }, { status: 500 });
  }
}
