"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function ClientLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
