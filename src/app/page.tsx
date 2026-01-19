"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Errore, riprova.");
        return;
      }

      setStatus("ok");
      setMessage(data?.already ? "Sei già in lista ✅" : "Perfetto! Sei in waitlist ✅");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Errore di rete. Riprova.");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "black" }} />
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: 0.5 }}>NOVA</h1>
        </div>

        <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.5 }}>
          Il tuo avatar AI per <strong>produttività</strong> e <strong>compagnia</strong>. Testo o voce, quando vuoi.
        </p>

        <div style={{ marginTop: 24, padding: 16, border: "1px solid #e5e5e5", borderRadius: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16 }}>Accesso anticipato</h2>
          <p style={{ marginTop: 8, marginBottom: 12, color: "#444" }}>
            Lascia la tua email per entrare nella waitlist.
          </p>

          <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@email.com"
              style={{ flex: "1 1 240px", padding: 12, borderRadius: 12, border: "1px solid #ccc" }}
              disabled={status === "loading"}
            />
            <button
              type="submit"
              style={{ padding: "12px 16px", borderRadius: 12, border: "none", background: "black", color: "white", cursor: "pointer", opacity: status === "loading" ? 0.7 : 1 }}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Invio..." : "Unisciti alla waitlist"}
            </button>
          </form>

          {message ? (
            <p style={{ marginTop: 10, fontSize: 13, color: status === "error" ? "#b00020" : "#1b5e20" }}>{message}</p>
          ) : (
            <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>Niente spam. Solo aggiornamenti sul lancio.</p>
          )}
        </div>

        <p style={{ marginTop: 18, fontSize: 12, color: "#666" }}>
          © {new Date().getFullYear()} NOVA. Tutti i diritti riservati.
        </p>
      </div>
    </main>
  );
}
