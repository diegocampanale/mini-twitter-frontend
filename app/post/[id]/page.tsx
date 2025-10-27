
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "@/components/organisms/PostCard";
import CommentSection from "@/components/molecules/CommentSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PostData } from "@/components/organisms/PostCard";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      // Fetch real posts from mock API and pick the one with matching id
      const res = await fetch(`/api/posts`);
      if (!res.ok) throw new Error('Errore nel fetch dei post');
      const posts: PostData[] = await res.json();
      const found = posts.find((p) => String(p.id) === String(postId)) ?? null;
      setPost(found);
    } catch (error) {
      console.error("Errore nel caricamento del post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Caricamento post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Post non trovato</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
        <div className="container max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 py-4">
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
              aria-label="Torna indietro"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {/* <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              </div> */}
              <h1 className="text-xl font-bold  text-blue">
                Post
              </h1>
            </div>
          </div>
        </div>
      {/* </div> */}

    <div className="container max-w-2xl mx-auto">
  <PostCard post={post} disableNavigation onUpdated={(u) => setPost(u)} />
        
        <div className="px-4 pb-8">
          <CommentSection postId={postId} fullHeight />
        </div>
      </div>
    </main>
  );
}