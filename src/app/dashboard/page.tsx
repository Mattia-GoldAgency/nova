"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/lib/profile";
import { getRecentEvents, AppEvent } from "@/lib/events";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [events, setEvents] = useState<AppEvent[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { user, profile } = await getMyProfile();

        if (!user) {
          router.replace("/login");
          return;
        }

        if (!profile || !profile.onboarding_completed) {
          router.replace("/onboarding");
          return;
        }

        setRole(profile.role);

        // carica eventi recenti
        const recent = await getRecentEvents(5);
        setEvents(recent);

        setLoading(false);
      } catch (e: any) {
        console.error("Errore dashboard:", e?.message ?? e);
        router.replace("/login");
      }
    })();
  }, [router]);

  if (loading) return <p style={{ padding: 24 }}>Caricamento...</p>;

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <section>
        <h1>Dashboard NOVA</h1>
        <p>
          Ruolo: <b>{role}</b>
        </p>
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
