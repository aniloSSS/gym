"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const productionSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anilosss.github.io/GYM/";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Connexion Google en cours...");

  useEffect(() => {
    async function finishSignIn() {
      try {
        const supabase = createSupabaseBrowserClient();
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          if (error) {
            throw error;
          }
        }

        await supabase.auth.getSession();
        window.history.replaceState(null, document.title, window.location.pathname);
        window.location.replace(productionSiteUrl);
      } catch (error) {
        const detail = error instanceof Error ? error.message : "Erreur inconnue.";
        setMessage(`Connexion impossible : ${detail}`);
      }
    }

    finishSignIn();
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass-panel w-full max-w-sm rounded-lg p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="mt-4 text-lg font-semibold">Retour de connexion</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
