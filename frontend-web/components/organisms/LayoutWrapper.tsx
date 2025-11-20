// components/organisms/LayoutWrapper.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import AuthenticatedNavbar from "./AuthenticatedNavbar";
import AuthenticatedSidebar from "./AuthenticatedSidebar";
import FloatingNewPostButton from "./FloatingNewPostButton";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Layout per utenti NON autenticati
  if (!isAuthenticated) {
    return (
      <>
        {/* Header mobile */}
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Container centrale: sidebar + content */}
        <div className="container max-w-5xl mx-auto px-4 min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="pt-14 md:pt-0 pb-20 md:pb-0">{children}</main>
          </div>
        </div>

        {/* Bottom navbar (solo mobile, nascosta quando sidebar aperta) */}
        <Navbar isHidden={isSidebarOpen} />
      </>
    );
  }

  // Layout per utenti AUTENTICATI
  return (
    <>
      {/* Desktop layout: centered container with sidebar attached to the main column */}
      <div className="container max-w-5xl mx-auto px-4 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6 min-h-screen">
          <AuthenticatedSidebar />
          <main className="pb-20 md:pb-0">{children}</main>
        </div>
      </div>

      {/* Bottom navbar mobile */}
      <AuthenticatedNavbar />

      {/* Floating button mobile */}
      <FloatingNewPostButton />
    </>
  );
}
