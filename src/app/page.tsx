"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const emailTrim = email.trim();
    if (!emailTrim) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrim }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Errore. Riprova.");
        return;
      }

      setStatus("ok");
      setMessage(data?.already ? "Sei già in lista ✅" : "Perfetto! Sei in waitlist ✅");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch {
      setStatus("error");
      setMessage("Errore di rete. Riprova.");
    }
  }

  const formDisabled = status !== "idle";

  const colors = {
    text: "rgba(255,255,255,0.92)",
    textMuted: "rgba(255,255,255,0.78)",
    textSoft: "rgba(255,255,255,0.62)",
    border: "rgba(255,255,255,0.14)",
    cardBg: "rgba(255,255,255,0.10)",
    inputBg: "rgba(255,255,255,0.07)",
    inputBorder: "rgba(255,255,255,0.18)",
    inputPlaceholder: "rgba(255,255,255,0.55)",
    danger: "rgba(255, 120, 140, 0.95)",
    success: "rgba(180, 255, 220, 0.92)",

    btnBorder: "rgba(255,255,255,0.18)",
    btnBg: "linear-gradient(135deg, rgba(0,38,100,0.55), rgba(55,0,95,0.55))",
    btnBgHover: "linear-gradient(135deg, rgba(0,60,145,0.62), rgba(95,0,155,0.62))",
    btnGlow:
      "0 18px 60px rgba(0,120,255,0.14), 0 18px 60px rgba(160,0,255,0.10)",
    btnGlowHover:
      "0 22px 80px rgba(0,120,255,0.20), 0 22px 80px rgba(160,0,255,0.16)",
  };

  // Stelle deterministiche (ma le renderizziamo solo dopo mount per evitare ogni mismatch residuo)
  const stars = useMemo(() => {
    const prand = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };

    const count = 70;

    return Array.from({ length: count }).map((_, i) => {
      const left = prand(i + 1) * 100;
      const top = prand(i + 2) * 100;
      const size = 1 + prand(i + 3) * 2;
      const opacity = 0.18 + prand(i + 4) * 0.5;
      const duration = 7 + prand(i + 5) * 12;
      const delay = prand(i + 6) * 8;
      return { i, left, top, size, opacity, duration, delay };
    });
  }, []);

  const year = mounted ? new Date().getFullYear() : "";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 28,
        color: colors.text,
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #05060f 0%, #070a1a 35%, #0b0f2a 60%, #09081f 100%)",
      }}
    >
      {/* Effetti SOLO dopo mount -> niente hydration mismatch */}
      {mounted && (
        <>
          {/* SFONDO: Parallax + Pulse */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -140,
              filter: "blur(10px)",
              opacity: 0.95,
              animation: "bgParallax 26s ease-in-out infinite alternate",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(1200px 650px at 18% 12%, rgba(0,120,255,0.38), rgba(0,0,0,0))," +
                  "radial-gradient(1050px 650px at 82% 18%, rgba(160,0,255,0.34), rgba(0,0,0,0))," +
                  "radial-gradient(850px 520px at 55% 85%, rgba(90,0,200,0.26), rgba(0,0,0,0))",
                animation: "bgPulse 22s ease-in-out infinite",
              }}
            />
          </div>

          {/* STELLE */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {stars.map((s) => (
              <span
                key={s.i}
                style={{
                  position: "absolute",
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.95)",
                  opacity: s.opacity,
                  boxShadow: "0 0 10px rgba(255,255,255,0.16)",
                  animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* CONTENUTO */}
      <div style={{ maxWidth: 760, width: "100%", position: "relative", zIndex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 30, letterSpacing: 0.6 }}>NOVA</h1>

        <p style={{ marginTop: 22, fontSize: 19, lineHeight: 1.55, color: colors.textMuted }}>
          Il tuo <strong style={{ color: colors.text }}>avatar AI</strong>, sempre{" "}
          <strong style={{ color: colors.text }}>presente</strong>, disponibile e coerente.
        </p>

        <div
          style={{
            marginTop: 26,
            padding: 20,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            background: colors.cardBg,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "0 22px 70px rgba(0,0,0,0.40)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 17 }}>Accedi al tuo futuro</h2>

          <form
            onSubmit={onSubmit}
            style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@email.com"
              style={{
                flex: "1 1 260px",
                padding: 13,
                borderRadius: 12,
                border: `1px solid ${colors.inputBorder}`,
                background: colors.inputBg,
                color: colors.text,
                outline: "none",
              }}
              disabled={formDisabled}
            />

            <button
              type="submit"
              disabled={formDisabled}
              style={{
                padding: "13px 18px",
                borderRadius: 12,
                border: `1px solid ${colors.btnBorder}`,
                background: colors.btnBg,
                color: "white",
                boxShadow: colors.btnGlow,
                cursor: formDisabled ? "default" : "pointer",
                opacity: formDisabled ? 0.75 : 1,
                transition: "background 200ms ease, box-shadow 220ms ease, transform 120ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = colors.btnBgHover;
                el.style.boxShadow = colors.btnGlowHover;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = colors.btnBg;
                el.style.boxShadow = colors.btnGlow;
                el.style.transform = "translateY(0)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              {status === "loading" ? "Invio..." : "Unisciti alla waitlist"}
            </button>
          </form>

          <p style={{ marginTop: 12, fontSize: 12.5, color: colors.textSoft }}>
            {message || "Niente spam. Solo aggiornamenti sul lancio."}
          </p>
        </div>

        <p style={{ marginTop: 20, fontSize: 12.5, color: colors.textSoft }}>
          {year ? `© ${year} NOVA` : "© NOVA"}
        </p>
      </div>

      <style>{`
        input::placeholder { color: ${colors.inputPlaceholder}; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.20; transform: scale(0.95); }
          50% { opacity: 0.80; transform: scale(1.15); }
        }

        @keyframes bgParallax {
          0% { transform: translate3d(-14px, -10px, 0) scale(1.03); }
          100% { transform: translate3d(16px, 12px, 0) scale(1.06); }
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 0.90; filter: saturate(1.08); }
          50% { opacity: 1.00; filter: saturate(1.16); }
        }
      `}</style>
    </main>
  );
}
