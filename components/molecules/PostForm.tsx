// components/molecules/PostForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TextArea from "@/components/atoms/TextArea";
import { Button } from "@/components/ui/button";

type PostFormProps = {
  onSubmit?: (content: string) => Promise<void>;
  placeholder?: string;
  submitLabel?: string;
};

export default function PostForm({
  onSubmit,
  placeholder = "Cosa stai pensando?",
  submitLabel = "Pubblica",
}: PostFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Il contenuto non può essere vuoto");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (onSubmit) {
        await onSubmit(content);
      } else {
        // Default: invia a /api/posts
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            author: { username: "you" }, // TODO: usare utente autenticato
          }),
        });

        if (!res.ok) {
          throw new Error("Errore nella pubblicazione del post");
        }
      }

      setContent("");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={6}
        error={error}
        disabled={loading}
      />
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Supporta Markdown: **grassetto**, _corsivo_, liste, ecc.
        </p>
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Pubblicazione..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
