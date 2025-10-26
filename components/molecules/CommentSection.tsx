
"use client";

import React, { useState, useEffect } from "react";
import CommentForm from "@/components/molecules/CommentForm";
import CommentList from "@/components/atoms/CommentList";


type CommentData = {
  id: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
};

type CommentSectionProps = {
  postId: string;
};

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dati mock
    const mockComments: CommentData[] = [
      {
        id: "1",
        content: "Bel post! Mi piace molto!",
        author: { username: "user1" },
        createdAt: new Date().toISOString(),
        likes: 2
      },
      {
        id: "2", 
        content: "Grazie per la condivisione!",
        author: { username: "user2" },
        createdAt: new Date().toISOString(),
        likes: 1
      }
    ];
    
    setComments(mockComments);
  }, [postId]);

  const handleCreateComment = async (content: string) => {
    const newComment: CommentData = {
      id: Date.now().toString(),
      content,
      author: { 
        username: "tu"
      },
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setComments(prev => [newComment, ...prev]);
  };

  const handleLikeComment = async (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 } 
        : comment
    ));
  };

  return (
    <div 
      className="mt-4 pt-4 border-t border-border/50"
      onClick={(e) => e.stopPropagation()} 
    >
      <CommentForm 
        onSubmit={handleCreateComment}
        placeholder="Scrivi un commento..."
        submitLabel="Commenta"
      />
      
      {loading ? (
        <div className="text-center text-muted-foreground py-4">Caricamento commenti...</div>
      ) : (
        <CommentList 
          comments={comments}
          onLikeComment={handleLikeComment}
        />
      )}
    </div>
  );
}