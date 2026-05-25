import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fit Transform",
  description: "Application personnelle de suivi fitness, nutrition et progression."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
