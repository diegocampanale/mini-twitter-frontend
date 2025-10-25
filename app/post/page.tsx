// app/post/page.tsx
"use client";

import React from "react";
import PostForm from "@/components/molecules/PostForm";

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Crea un nuovo post</h1>
          <p className="text-sm text-muted-foreground">
            Condividi i tuoi pensieri con la community
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <PostForm />
        </div>
      </div>
    </main>
  );
}
