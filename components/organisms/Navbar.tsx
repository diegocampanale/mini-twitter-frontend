// components/organisms/Navbar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isHidden?: boolean;
}

export default function Navbar({ isHidden = false }: NavbarProps) {
  if (isHidden) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Nome sito */}
        <Link href="/" className="text-xl font-bold text-foreground">
          MiniTwitter
        </Link>
        
        {/* Bottoni login */}
        <div className="flex gap-3">
          <Link href="/signup">
            <Button className="rounded-full font-medium">
              Crea Account
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" className="rounded-full font-medium">
              Accedi
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
