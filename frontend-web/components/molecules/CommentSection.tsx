
"use client";

import React, { useState, useEffect } from "react";
import CommentForm from "@/components/molecules/CommentForm";
import CommentList from "@/components/atoms/CommentList";
import { useAuth } from "@/contexts/AuthContext";
import { getComments, createComment, deleteComment } from "@/lib/api";
import ConfirmDialog from "@/components/atoms/confirmDialog";

type CommentData = {
  id: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  user_id?: string;
};

type CommentSectionProps = {
  postId: string;
  fullHeight?: boolean;
};

export default function CommentSection({ postId, fullHeight = false }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await getComments(postId);

      const formattedComments: CommentData[] = (response.items || []).map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        author: { 
          username: comment.users?.username || "Utente",
          avatar: comment.users?.avatar
        },
        createdAt: comment.created_at,
        likes: comment.likes_count || 0,
        user_id: comment.user_id,
      }));

     
      const sortedComments = formattedComments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setComments(sortedComments);
    } catch (err) {
      console.error("Errore nel caricamento commenti:", err);
      setError("Errore nel caricamento commenti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleCreateComment = async (content: string) => {
    if (!isAuthenticated || !user?.id) {
      alert("Devi essere loggato per commentare");
      return;
    }

    try {
      await createComment(postId, user.id, content);
      await loadComments(); 
    } catch (err) {
      console.error("Errore nella creazione commento:", err);
      const errorMessage = err instanceof Error ? err.message : "Errore nella pubblicazione del commento";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const openDeleteConfirm = (commentId: string) => {
    setCommentToDelete(commentId);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!commentToDelete) return;

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        throw new Error("Token di autenticazione non trovato");
      }

      await deleteComment(commentToDelete, token);
      await loadComments(); 
    } catch (error) {
      console.error("Errore nell'eliminazione del commento:", error);
      alert("Errore durante l'eliminazione del commento");
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    openDeleteConfirm(commentId);
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
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Elimina commento"
        description="Sei sicuro di voler eliminare questo commento? Questa azione non può essere annullata."
        onConfirm={executeDelete}
        confirmText="Elimina"
        variant="destructive"
      />

      <CommentForm 
        onSubmit={handleCreateComment}
        placeholder="Scrivi un commento..."
        submitLabel="Commenta"
      />
      
      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}
      
      {loading ? (
        <div className="text-center text-muted-foreground py-4">Caricamento commenti...</div>
      ) : (
        <CommentList 
          comments={comments}
          onLikeComment={handleLikeComment}
          onDeleteComment={handleDeleteComment}
          currentUserId={user?.id}
          fullHeight={fullHeight}
        />
      )}
    </div>
  );
}