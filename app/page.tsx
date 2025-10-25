"use client";

import { useAuth } from "@/contexts/AuthContext";
import Feed from "@/components/organisms/Feed";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-background">

      {isAuthenticated ? (
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-2xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Il tuo Feed</h1>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-2xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Discover</h1>
          </div>
        </div>
      )}

      <Feed />
    </main>
  );
}