// components/organisms/LayoutWrapper.tsx
"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
