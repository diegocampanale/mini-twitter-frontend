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
    <aside className="hidden md:block w-72 bg-background border-r border-border">
      <div className="flex flex-col h-full p-6">
        {/* Logo / brand */}
        <div className="flex items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary">
            MiniTwitter
          </Link>
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
