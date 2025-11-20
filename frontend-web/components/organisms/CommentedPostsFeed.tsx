
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getComments, getPost, deleteComment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/atoms/confirmDialog";

type CommentWithPost = {
  id: string;
  content: string;
  createdAt: string;
  post: {
    id: string;
    content: string;
    author: {
      username: string;
    };
  };
};

export default function UserCommentsFeed() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{id: string, postId: string} | null>(null);
  const { user } = useAuth();

  async function loadUserComments() {
    if (!user?.id) {
      setError("Devi essere loggato per vedere i tuoi commenti");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const allCommentsResponse = await getComments('');
      
      const userComments = (allCommentsResponse.items || []).filter(
        (comment: any) => comment.user_id === user.id
      );
      
      const commentsWithPosts = await Promise.all(
        userComments.map(async (comment: any) => {
          try {
            const post = await getPost(comment.post_id);
            return {
              id: comment.id,
              content: comment.content,
              createdAt: comment.created_at,
              post: {
                id: post.id,
                content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
                author: post.author || { username: 'Utente' }
              }
            };
          } catch (err) {
            console.error(`Errore nel caricamento post ${comment.post_id}:`, err);
            return null;
          }
        })
      );
      
      // ORDINAMENTO CRONOLOGICO INVERSO - dal più recente al più vecchio
      const filteredComments = commentsWithPosts.filter(Boolean) as CommentWithPost[];
      const sortedComments = filteredComments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setComments(sortedComments);
    } catch (e) {
      console.error("Errore nel caricamento dei commenti:", e);
      setError(e instanceof Error ? e.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  const openDeleteConfirm = (commentId: string, postId: string) => {
    setCommentToDelete({ id: commentId, postId });
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!commentToDelete) return;

    const { id: commentId, postId } = commentToDelete;
    setDeletingId(commentId);
    
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        throw new Error("Token di autenticazione non trovato");
      }

      await deleteComment(commentId, token);
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Errore nell'eliminazione del commento:", error);
      alert("Errore durante l'eliminazione del commento: " + (error instanceof Error ? error.message : "Errore sconosciuto"));
    } finally {
      setDeletingId(null);
      setCommentToDelete(null);
    }
  };

  useEffect(() => {
    loadUserComments();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Devi essere loggato per vedere i tuoi commenti.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Caricamento commenti...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">Ancora nessun commento</p>
          <p className="text-sm">I commenti che pubblichi appariranno qui.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Elimina commento"
        description="Sei sicuro di voler eliminare questo commento? Questa azione non può essere annullata."
        onConfirm={executeDelete}
        confirmText="Elimina"
        variant="destructive"
      />

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border border-border rounded-lg p-4 bg-card relative">
            <div className="absolute top-3 right-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => openDeleteConfirm(comment.id, comment.post.id)}
                disabled={deletingId === comment.id}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between items-start mb-2 pr-10">
              <div className="text-sm text-muted-foreground">
                Commento su post di <strong>@{comment.post.author.username}</strong>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString('it-IT')}
              </div>
            </div>
            
            <div className="mb-3 p-3 bg-muted/30 rounded text-sm">
              <strong>Post:</strong> {comment.post.content}
            </div>
            
            <div className="text-sm">
              <strong>Il tuo commento:</strong> {comment.content}
            </div>
            
            <div className="mt-3">
              <button 
                onClick={() => window.open(`/post/${comment.post.id}`, '_blank')}
                className="text-xs text-primary hover:underline"
              >
                Vai al post →
              </button>
            </div>

            {deletingId === comment.id && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="text-sm">Eliminazione...</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}