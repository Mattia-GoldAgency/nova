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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Se per qualche motivo su Vercel mancano le env, evitiamo crash
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { ok: false, error: "Configurazione mancante. Riprova più tardi." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("waitlist").insert([{ email }]);

    if (error) {
      const msg = ((error as any).message?.toString() ?? "").toLowerCase();

      // Duplicato: email già presente (unique constraint)
      // Supabase/Postgres possono usare messaggi diversi
      const isDuplicate =
        msg.includes("duplicate") ||
        msg.includes("already exists") ||
        msg.includes("unique") ||
        msg.includes("violates unique constraint");

      if (isDuplicate) {
        return NextResponse.json({ ok: true, already: true });
      }

      // Non esponiamo dettagli tecnici
      return NextResponse.json(
        { ok: false, error: "Non riesco a salvare ora. Riprova tra poco." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Errore imprevisto" }, { status: 500 });
  }
}
