"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, BarChart3, CalendarDays, Dumbbell, Home, User } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/seances", label: "Mes séances", icon: Dumbbell },
  { href: "/repas", label: "Repas", icon: Apple },
  { href: "/calendrier", label: "Calendrier", icon: CalendarDays },
  { href: "/suivi", label: "Suivi", icon: BarChart3 },
  { href: "/profil", label: "Profil", icon: User }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-white/10 bg-background/78 p-4 backdrop-blur-xl lg:block">
        <Brand />
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} active={pathname === item.href} {...item} />
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/10 bg-white/[0.05] p-4">
          <p className="text-sm font-medium">Objectif semaine</p>
          <p className="mt-1 text-xs text-muted-foreground">3 séances, 150 g de protéines, progression régulière.</p>
          <div className="mt-4">
            <AuthButton />
          </div>
        </div>
      </aside>

      <div className="lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl lg:hidden">
          <Brand compact />
          <div className="flex items-center gap-2">
            <AuthButton compact />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-6 border-t border-white/10 bg-background/88 px-2 py-2 backdrop-blur-xl lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px] font-medium text-muted-foreground transition-colors",
                  active && "bg-primary/12 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="max-w-full truncate">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg shadow-glow">
        <BrandMark className="h-10 w-10" />
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-semibold">Fit Transform</p>
          <p className="text-xs text-muted-foreground">Personal tracker</p>
        </div>
      )}
      {compact && <p className="text-sm font-semibold">Fit Transform</p>}
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground",
        active && "bg-primary/12 text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
