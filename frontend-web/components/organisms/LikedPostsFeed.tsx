// components/organisms/LikedPostsFeed.tsx
"use client";

import React, { useEffect, useState } from "react";
import PostCard, { PostData } from "@/components/organisms/PostCard";
import { getLikedPosts } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LikedPostsFeed() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  async function loadLikedPosts() {
    if (!user?.id) {
      setError("Devi essere loggato per vedere i tuoi like");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const likedPosts = await getLikedPosts(user.id);
      setPosts(likedPosts);
    } catch (e) {
      console.error("Errore nel caricamento dei post piaciuti:", e);
      setError(e instanceof Error ? e.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLikedPosts();
  }, [user?.id]);

  const handleLike = async (postId: string, liked: boolean) => {
    if (!liked) {
     
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { 
              ...p, 
              likedByUser: liked, 
              likes_count: (p.likes_count || 0) + (liked ? 1 : -1)
            }
          : p
      )
    );
  };

  const handleComment = async (postId: string) => {
    console.log("Apertura commenti per post:", postId);
  };

  const handleShare = async (postId: string) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiato negli appunti!");
    } catch {
      alert("Copia non riuscita");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Devi essere loggato per vedere i post che ti piacciono.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {loading && (
        <div className="text-center text-sm text-muted-foreground py-8">
          Caricamento post che ti piacciono...
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-destructive py-8 border-y border-destructive/20 bg-destructive/5 px-4 mx-4">
          Errore: {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <p className="text-lg mb-2">Ancora nessun like</p>
            <p className="text-sm">I post a cui metti mi piace appariranno qui.</p>
          </div>
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