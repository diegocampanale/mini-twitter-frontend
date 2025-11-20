
"use client";

import React, { useState, useEffect } from "react";
import PostCard, { PostData } from "./PostCard";
import { getPosts } from "@/lib/api";

type PostFeedProps = {
  userId?: string;
  onPostDeleted?: (postId: string) => void;
};

export default function PostFeed({ userId, onPostDeleted }: PostFeedProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const postsData = await getPosts(userId ? { user_id: userId } : {});
      setPosts(postsData);
    } catch (err) {
      console.error("Errore nel caricamento posts:", err);
      setError("Errore nel caricamento dei post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const handlePostDeleted = (postId: string) => {

    setPosts(prev => prev.filter(post => post.id !== postId));
    
    onPostDeleted?.(postId);
  };

  const handlePostUpdated = (updatedPost: PostData) => {
  
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento post...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">Ancora nessun post</p>
          <p className="text-sm">I post che pubblichi appariranno qui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDeleted={handlePostDeleted}
          onUpdated={handlePostUpdated}
        />
      ))}
    </div>
  );
}