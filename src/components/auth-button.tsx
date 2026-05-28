"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AlertCircle, CheckCircle2, Loader2, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const productionSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anilosss.github.io/gym/";

export function AuthButton({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    try {
      const supabase = createSupabaseBrowserClient();

      recoverSessionFromUrl(supabase)
        .then(() => supabase.auth.getSession())
        .then(({ data, error }) => {
          if (!mounted) {
            return;
          }

          if (error) {
            setErrorMessage(error.message);
          }

          setUser(data.session?.user ?? null);
          cleanAuthCallbackUrl();
          setLoading(false);
        })
        .catch((error) => {
          if (!mounted) {
            return;
          }

          setErrorMessage(error instanceof Error ? error.message : "Connexion Google impossible.");
          cleanAuthCallbackUrl();
          setLoading(false);
        });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        cleanAuthCallbackUrl();
        setLoading(false);
      });

      return () => {
        mounted = false;
        data.subscription.unsubscribe();
      };
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Configuration Supabase manquante.");
      setLoading(false);
    }
  }, []);

  async function signInWithGoogle() {
    setBusy(true);
    setErrorMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = getAuthRedirectUrl();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: "select_account"
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data.url) {
        throw new Error("Supabase n'a pas renvoye d'URL Google.");
      }

      window.location.assign(data.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connexion Google impossible.";
      setErrorMessage(message);
      window.alert(`Connexion Google impossible : ${message}`);
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setErrorMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Deconnexion impossible.");
    } finally {
      setBusy(false);
    }
  }

  if (compact) {
    const Icon = loading || busy ? Loader2 : user ? LogOut : LogIn;
    return (
      <Button
        size="icon"
        variant="ghost"
        aria-label={user ? "Deconnexion" : "Connexion Google"}
        onClick={user ? signOut : signInWithGoogle}
        disabled={loading || busy}
      >
        <Icon className={loading || busy ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
      </Button>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connexion...
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">Connecte</p>
            <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button className="w-full" variant="ghost" size="sm" onClick={signOut} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Quitter
        </Button>
        {errorMessage && <AuthError message={errorMessage} />}
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Button variant="secondary" size="sm" onClick={signInWithGoogle} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {busy ? "Redirection..." : "Connexion Google"}
      </Button>
      {errorMessage && <AuthError message={errorMessage} />}
    </div>
  );
}

function getAuthRedirectUrl() {
  return new URL("auth/callback/", productionSiteUrl).toString();
}

async function recoverSessionFromUrl(supabase: ReturnType<typeof createSupabaseBrowserClient>) {
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
}

function cleanAuthCallbackUrl() {
  const url = new URL(window.location.href);
  const authHash =
    url.hash.includes("access_token=") ||
    url.hash.includes("refresh_token=") ||
    url.hash.includes("provider_token=");
  const authQuery = url.searchParams.has("code") || url.searchParams.has("error");

  if (!authHash && !authQuery) {
    return;
  }

  if (authHash) {
    url.hash = "";
  }

  for (const param of ["code", "error", "error_description", "error_code"]) {
    url.searchParams.delete(param);
  }

  window.history.replaceState(null, document.title, `${url.pathname}${url.search}${url.hash}`);
}

function AuthError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-[11px] leading-4 text-red-100">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
