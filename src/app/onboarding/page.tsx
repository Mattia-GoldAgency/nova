"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { logEvent } from "@/lib/events";

export default function OnboardingPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveOnboarding() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    // Con proxy attivo, qui l'utente dovrebbe sempre esserci.
    // Se manca, mostriamo errore (non redirectiamo dal client).
    if (!user) throw new Error("Sessione non valida. Ripeti il login.");

    const { error } = await supabase
      .from("user_profiles")
      .upsert({ id: user.id, onboarding_completed: true }, { onConflict: "id" });

    if (error) throw error;
  }

  async function onConfirm() {
    setSaving(true);
    setError("");

    try {
      await saveOnboarding();
      await logEvent("onboarding_completed");
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message ?? "Errore nel salvataggio. Riprova.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <section style={{ width: 520, display: "grid", gap: 12 }}>
        <h1>Onboarding NOVA</h1>
        <p>Benvenuto in NOVA. Completa la configurazione iniziale per continuare.</p>

        <button type="button" onClick={onConfirm} disabled={saving} style={{ padding: 12 }}>
          {saving ? "Salvataggio..." : "Continua"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
    </main>
  );
}

