"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logEvent } from "@/lib/events";
import { getMyProfile } from "@/lib/profile";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ctaLoading, setCtaLoading] = useState<null | "conversation" | "journal" | "task">(null);

  useEffect(() => {
    (async () => {
      try {
        setError("");

        // Con proxy attivo, qui l'utente dovrebbe essere loggato e onboarded.
        // Quindi NON facciamo redirect dal client: carichiamo solo dati UI.
        const { user, profile } = await getMyProfile();

        if (!user || !profile) {
          setError("Sessione non valida o profilo mancante. Ricarica la pagina.");
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (e: any) {
        console.error("Errore dashboard:", e?.message ?? e);
        setError("Errore caricamento dashboard. Ricarica la pagina.");
        setLoading(false);
      }
    })();
  }, []);

  async function handleStartConversation() {
    try {
      setCtaLoading("conversation");
      setError("");

      await logEvent("cta_start_conversation_clicked");
      router.push("/session/new");
    } catch (e: any) {
      console.error("Errore avvio conversazione:", e?.message ?? e);
      setError("Errore nell'avvio della conversazione. Riprova.");
    } finally {
      setCtaLoading(null);
    }
  }

  async function handleJournal() {
    try {
      setCtaLoading("journal");
      setError("");

      await logEvent("cta_journal_clicked");
      // Placeholder: nessuna feature definitiva ancora
      setError("Diario non ancora disponibile (placeholder).");
    } catch (e: any) {
      console.error("Errore CTA diario:", e?.message ?? e);
      setError("Errore. Riprova.");
    } finally {
      setCtaLoading(null);
    }
  }

  async function handleTask() {
    try {
      setCtaLoading("task");
      setError("");

      await logEvent("cta_task_clicked");
      // Placeholder: nessuna feature definitiva ancora
      setError("Task non ancora disponibili (placeholder).");
    } catch (e: any) {
      console.error("Errore CTA task:", e?.message ?? e);
      setError("Errore. Riprova.");
    } finally {
      setCtaLoading(null);
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Caricamento...</p>;

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <section>
        <h1>Dashboard NOVA</h1>
        <p style={{ opacity: 0.8 }}>
          Stato: <b>Attivo</b>
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>

      <section style={{ border: "1px solid #ddd", padding: 12, display: "grid", gap: 10 }}>
        <h2 style={{ marginTop: 0 }}>Avvio</h2>

        <button
          onClick={handleStartConversation}
          disabled={ctaLoading !== null}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #ccc",
            fontSize: 15,
            cursor: ctaLoading ? "not-allowed" : "pointer",
          }}
        >
          {ctaLoading === "conversation" ? "Avvio..." : "Avvia conversazione"}
        </button>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={handleJournal}
            disabled={ctaLoading !== null}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ccc",
              fontSize: 14,
              cursor: ctaLoading ? "not-allowed" : "pointer",
            }}
          >
            {ctaLoading === "journal" ? "..." : "Diario (placeholder)"}
          </button>

          <button
            onClick={handleTask}
            disabled={ctaLoading !== null}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ccc",
              fontSize: 14,
              cursor: ctaLoading ? "not-allowed" : "pointer",
            }}
          >
            {ctaLoading === "task" ? "..." : "Task (placeholder)"}
          </button>
        </div>

        <p style={{ marginTop: 6, opacity: 0.8, fontSize: 13 }}>
          Testo e voce saranno sempre disponibili durante la conversazione (non sono modalità esclusive).
        </p>
      </section>
    </main>
  );
}
