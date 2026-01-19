"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { logEvent } from "@/lib/events"; // 👈 STEP 7D

type Role = "assistant" | "companion";

export default function OnboardingPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Se uno arriva qui già onboarded, lo rimandiamo in dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("onboarding_completed")
        .eq("id", data.user.id)
        .maybeSingle();

      if (error) {
        console.error("Errore lettura user_profiles:", error.message);
        return; // non blocchiamo: l'utente può comunque completare onboarding
      }

      if (profile?.onboarding_completed) router.replace("/dashboard");
    })();
  }, [router]);

  async function saveOnboarding(role: Role) {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase
      .from("user_profiles")
      .upsert(
        { id: user.id, role, onboarding_completed: true },
        { onConflict: "id" }
      );

    if (error) throw error;
  }

  async function onConfirm() {
    if (!selectedRole) {
      setError("Seleziona una delle due opzioni.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await saveOnboarding(selectedRole);

      // ✅ STEP 7D: log evento onboarding completato
      await logEvent("onboarding_completed", { role: selectedRole });

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
        <p>Seleziona il tipo di esperienza.</p>

        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={() => setSelectedRole("assistant")}
            disabled={saving}
            style={{
              padding: 12,
              border: "1px solid #ccc",
              background: selectedRole === "assistant" ? "#eee" : "white",
              textAlign: "left",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <b>Assistant</b>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              Modalità operativa: task, strumenti, efficienza.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("companion")}
            disabled={saving}
            style={{
              padding: 12,
              border: "1px solid #ccc",
              background: selectedRole === "companion" ? "#eee" : "white",
              textAlign: "left",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <b>Companion</b>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              Modalità più personale: supporto, journaling, accompagnamento.
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={saving}
          style={{ padding: 12 }}
        >
          {saving ? "Salvataggio..." : "Conferma e continua"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
    </main>
  );
}
