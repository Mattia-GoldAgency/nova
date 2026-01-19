"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { getPostLoginPath } from "@/lib/routing";
import { logEvent } from "@/lib/events"; // 👈 STEP 7C

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // ✅ STEP 7C: log evento login riuscito
      await logEvent("login_success", { method: "password" });

      // ✅ Redirect intelligente (STEP 4B)
      const path = await getPostLoginPath();
      router.push(path);
    } catch (e: any) {
      setError(e?.message ?? "Errore durante l'accesso. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={onSubmit} style={{ width: 320, display: "grid", gap: 12 }}>
        <h1>Accedi a NOVA</h1>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Accesso..." : "Accedi"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </main>
  );
}
