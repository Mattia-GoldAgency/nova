"use client";

import { useEffect, useState } from "react";
import { getMyProfile } from "@/lib/profile";
import { getRecentEvents, AppEvent } from "@/lib/events";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Con proxy attivo, qui l'utente dovrebbe sempre essere loggato e onboarded.
        // Quindi NON facciamo redirect dal client: carichiamo solo dati UI.
        const { user, profile } = await getMyProfile();

        if (!user || !profile) {
          setError("Sessione non valida o profilo mancante. Ricarica la pagina.");
          setLoading(false);
          return;
        }

        setRole(profile.role);

        const recent = await getRecentEvents(5);
        setEvents(recent);

        setLoading(false);
      } catch (e: any) {
        console.error("Errore dashboard:", e?.message ?? e);
        setError("Errore caricamento dashboard. Ricarica la pagina.");
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Caricamento...</p>;

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <section>
        <h1>Dashboard NOVA</h1>
        {role && (
          <p>
            Ruolo: <b>{role}</b>
          </p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>

      <section style={{ border: "1px solid #ddd", padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Attività recente</h2>

        {events.length === 0 ? (
          <p style={{ opacity: 0.8 }}>Nessuna attività registrata.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {events.map((ev) => (
              <li key={ev.id}>
                <b>{ev.type}</b>{" "}
                <span style={{ opacity: 0.8 }}>
                  — {new Date(ev.created_at).toLocaleString("it-IT")}
                </span>
                {ev.payload && Object.keys(ev.payload).length > 0 && (
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    payload: {JSON.stringify(ev.payload)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
