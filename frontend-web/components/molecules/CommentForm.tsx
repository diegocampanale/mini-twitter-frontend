// components/molecules/CommentForm.tsx
"use client";

import React, { useState } from "react";
import TextArea from "@/components/atoms/TextArea";
import { Button } from "@/components/ui/button";

type CommentFormProps = {
  onSubmit?: (content: string) => Promise<void>;
  placeholder?: string;
  submitLabel?: string;
};

export default function CommentForm({
  onSubmit,
  placeholder = "Scrivi un commento...",
  submitLabel = "Commenta",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!content.trim()) {
    setError("Il commento non può essere vuoto");
    return;
  }

  setLoading(true);
  setError("");

  try {
    if (onSubmit) {
      await onSubmit(content);
      setContent(""); 
    }
  } catch (err) {
    setError("Errore nella pubblicazione del commento");
    console.error("Errore:", err);
  } finally {
    setLoading(false);
  }
};
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={2}
        error={error}
        disabled={loading}
      />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading || !content.trim()}
          size="sm"
        >
          {loading ? "Pubblicazione..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}