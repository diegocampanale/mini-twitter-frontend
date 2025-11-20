
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TextArea from "@/components/atoms/TextArea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createPost } from "@/lib/api";

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
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Il contenuto non può essere vuoto");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!auth || !auth.isAuthenticated) {
        setError("Devi essere autenticato per pubblicare.");
        setLoading(false);
        return;
      }

      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setError("Token di autenticazione non trovato. Effettua nuovamente il login.");
        setLoading(false);
        return;
      }

   
      const cleanedContent = content.trim();

      if (onSubmit) {
        await onSubmit(cleanedContent);
      } else {
        if (!auth.user?.id) {
          console.error("Auth user:", auth.user);
          setError("ID utente non trovato. Effettua nuovamente il login.");
          setLoading(false);
          return;
        }
        
        console.log("Creating post with user_id:", auth.user.id, "content:", cleanedContent);
        await createPost({ user_id: auth.user.id, content: cleanedContent }, token);
      }

      setContent("");
      
      router.refresh();
    } catch (err) {
      console.error("Errore nella creazione del post:", err);
      setError(err instanceof Error ? err.message : "Errore nella pubblicazione del post");
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