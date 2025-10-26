
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "@/components/organisms/PostCard";
import CommentSection from "@/components/molecules/CommentSection";
import Icon from "@/components/atoms/Icon";
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
      // Simulazione API
      const mockPost: PostData = {
        id: postId,
        content: "Questo è un post di esempio con tutti i dettagli. Qui puoi vedere il contenuto completo e tutti i commenti.",
        author: { 
          username: "user1",
          avatar: "/avatar1.jpg"
        },
        createdAt: new Date().toISOString(),
        likes: 15,
        comments: 8
      };
      
      setPost(mockPost);
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
            
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center hover:bg-muted rounded-lg transition-colors border border-white h-6 w-6"
              aria-label="Torna indietro"
            
            > ↩
            </button>
            
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
        <PostCard post={post} />
        
        <div className="px-4 pb-8">
          <CommentSection postId={postId} />
        </div>
      </div>
    </main>
  );
}