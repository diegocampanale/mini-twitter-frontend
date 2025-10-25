// components/organisms/Feed.tsx
"use client";

import React, { useEffect, useState } from "react";
import PostCard, { PostData } from "@/components/organisms/PostCard";

type FeedProps = {
  apiEndpoint?: string;
};

export default function Feed({ apiEndpoint = "/api/posts" }: FeedProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiEndpoint);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error("Errore nel caricamento dei post:", e);
      setError(e instanceof Error ? e.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [apiEndpoint]);

  const handleLike = (postId: string) => {
    console.log("Like post:", postId);
    // TODO: chiamata API per like
  };

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId);
    // TODO: navigazione a pagina commenti
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
    // TODO: logica share
  };

  return (
    <div className="w-full max-w-2xl mx-auto border-x border-border">
      {loading && (
        <div className="text-center text-sm text-muted-foreground py-8">
          Caricamento post...
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-destructive py-8 border-y border-destructive/20 bg-destructive/5 px-4 mx-4">
          Errore: {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8">
          Nessun post disponibile.
        </div>
      )}

      {!loading && !error && posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}
