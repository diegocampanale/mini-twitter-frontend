// components/organisms/Sidebar.tsx
"use client";

import Link from "next/link";
import { Home, Hash, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay per mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-background border-r border-border z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:top-auto md:left-auto md:bottom-auto
      `}>
        <div className="flex flex-col h-full p-6 justify-between">

            <div className="flex flex-col">
                {/* Logo e close button (mobile) */}
                <div className="flex items-center justify-between mb-8">

                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="md:hidden"
                    >
                    <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Titolo e bottoni (desktop) */}
                <div className="hidden md:block mb-8 ">
                    <h2 className="text-2xl font-bold mb-4">
                    Partecipa alla conversazione
                    </h2>
                    <div className="flex flex-col gap-3">
                    <Link href="/signup">
                        <Button className="w-full rounded-full font-medium">
                        Crea account
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" className="w-full rounded-full font-medium">
                        Accedi
                        </Button>
                    </Link>
                    </div>
                </div>

                {/* Titolo mobile */}
                <div className="md:hidden mb-6">
                    <h2 className="text-2xl font-bold">
                    Partecipa alla conversazione
                    </h2>
                </div>

                {/* Bottoni mobile */}
                <div className="md:hidden flex gap-3 mb-8">
                    <Link href="/signup" className="flex-1" onClick={onClose}>
                    <Button className="w-full rounded-full font-medium">
                        Crea account
                    </Button>
                    </Link>
                    <Link href="/login" className="flex-1" onClick={onClose}>
                    <Button variant="outline" className="w-full rounded-full font-medium">
                        Accedi
                    </Button>
                    </Link>
                </div>

                {/* Menu di navigazione */}
                {/* <nav className="flex flex-col gap-2">
                    <Link 
                    href="/" 
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-lg font-medium"
                    >
                    <Home className="h-6 w-6" />
                    <span>Home</span>
                    </Link>
                    <Link 
                    href="/" 
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-lg font-medium"
                    >
                    <Hash className="h-6 w-6" />
                    <span>Feed</span>
                    </Link>
                </nav> */}
            </div>

            {/* Footer links */}
            <div className="pt-6 flex flex-col gap-2 text-sm">
                <Link href="/terms" className="text-primary hover:underline">
                Termini di servizio
                </Link>
                <Link href="/privacy" className="text-primary hover:underline">
                Informativa sulla privacy
                </Link>
            </div>

        </div>
      </aside>
    </>
  );
}
