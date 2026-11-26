import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutShell from "@/components/ClientLayoutShell";

export const metadata: Metadata = {
  title: "Barangay Information System (BIS v2.5) | Barangay Sta. Lucia",
  description:
    "Official Barangay Information System and Administrative Management Portal for Barangay Sta. Lucia, Lungsod Quezon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-slate-50 text-slate-900 font-sans">
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}
