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
        
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* Main content */}
        <div className="md:ml-72 pt-14 md:pt-0 pb-20 md:pb-0">
          {children}
        </div>
        
        {/* Bottom navbar (solo mobile) */}
        <Navbar />
      </>
    );
  }

  // Layout per utenti AUTENTICATI
  return (
    <>
      {/* Sidebar desktop */}
      <AuthenticatedSidebar />
      
      {/* Main content */}
      <div className="md:ml-72 pb-20 md:pb-0">
        {children}
      </div>
      
      {/* Bottom navbar mobile */}
      <AuthenticatedNavbar />
      
      {/* Floating button mobile */}
      <FloatingNewPostButton />
    </>
  );
}
