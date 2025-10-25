"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, User, LogOut, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function AuthenticatedSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/likes", icon: Heart, label: "Likes" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className="hidden md:block fixed top-0 left-0 bottom-0 w-72 bg-background border-r border-border z-50">
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.5 3C6.015 3 4 5.015 4 7.5c0 1.75 1 3.25 2.5 4l-1.5 6.5c-.125.5.25 1 .75 1h2.5c.5 0 .875-.5.75-1L7.5 11.5c1.5-.75 2.5-2.25 2.5-4C10 5.015 7.985 3 5.5 3zm7 0c-2.485 0-4.5 2.015-4.5 4.5 0 1.75 1 3.25 2.5 4l-1.5 6.5c-.125.5.25 1 .75 1h2.5c.5 0 .875-.5.75-1L14.5 11.5c1.5-.75 2.5-2.25 2.5-4C17 5.015 14.985 3 12.5 3z"/>
          </svg>
        </div>

        {/* User info */}
        <div className="mb-6 pb-6 border-b border-border">
          <p className="font-semibold text-foreground">@{user?.username}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Nuovo Post Button */}
        <Link href="/post" className="mb-6">
          <Button className="w-full rounded-full font-medium flex items-center gap-2">
            <PenSquare className="h-5 w-5" />
            Nuovo Post
          </Button>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-lg font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-6 w-6" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Esci
          </Button>
        </div>
      </div>
    </aside>
  );
}
