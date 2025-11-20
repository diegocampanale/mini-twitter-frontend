// components/organisms/MobileHeader.tsx
"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Hamburger menu a sinistra */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-foreground"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Logo al centro */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          {/* <Logo /> */}
        </div>
        
        {/* Spazio a destra per bilanciare */}
        <div className="w-10" />
      </div>
    </header>
  );
}
