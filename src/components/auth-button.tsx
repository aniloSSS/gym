"use client";

import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthButton() {
  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="secondary" size="sm" onClick={signInWithGoogle}>
        <LogIn className="h-4 w-4" />
        Google
      </Button>
      <Button variant="ghost" size="sm" onClick={signOut}>
        <LogOut className="h-4 w-4" />
        Quitter
      </Button>
    </div>
  );
}
