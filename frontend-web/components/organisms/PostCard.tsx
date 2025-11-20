
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PostHeader from "@/components/molecules/PostHeader";
import PostContent from "@/components/molecules/PostContent";
import PostActions from "@/components/molecules/PostActions";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import TextArea from "@/components/atoms/TextArea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; 
import ConfirmDialog from "@/components/atoms/confirmDialog";

export type PostData = {
  id: string;
  author?: {
    username?: string;
    avatar?: string;
  };
  content: string;
  createdAt?: string;
  likes?: number;          
  likes_count?: number;   
  likedByUser?: boolean;  
  comments?: number;
  user_id?: string;
};

type PostCardProps = {
  post: PostData;
  onLike?: (postId: string, liked: boolean) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  disableNavigation?: boolean;
  onUpdated?: (post: PostData) => void;
  onDeleted?: (postId: string) => void;
};

export default function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  disableNavigation, 
  onUpdated,
  onDeleted 
}: PostCardProps) {
  const auth = useAuth();
  const router = useRouter();
  
  const isEditable = !!(auth.user && post.user_id && auth.user.id === post.user_id);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (postId: string) => {
    setEditContent(post.content);
    setIsEditOpen(true);
  };

  const handleDelete = (postId: string) => {
    setIsDeleteOpen(true);
  };

  const saveEdit = async (postId: string) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        throw new Error("Token di autenticazione non trovato");
      }

      const { updatePost } = await import("@/lib/api");
      const updated = await updatePost(postId, { content: editContent }, token);
      
      if (onUpdated) {
        onUpdated(updated as PostData);
      } else {
        window.location.reload();
      }
      setIsEditOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore durante l'aggiornamento");
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    setDeleting(true);
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        throw new Error("Token di autenticazione non trovato");
      }

      const { deletePost } = await import("@/lib/api");
      await deletePost(post.id, token);
      
      if (onDeleted) {
        onDeleted(post.id);
      } else {
        window.location.reload();
      }
      setIsDeleteOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore durante l'eliminazione");
    } finally {
      setDeleting(false);
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    if (disableNavigation) return;
    if ((e.target as HTMLElement).closest('a')) return;

    if (
      !(e.target as HTMLElement).closest('button') &&
      !(e.target as HTMLElement).closest('[data-comment-section]')
    ) {
      router.push(`/post/${post.id}`);
    }
  };

  const handleLike = (postId: string, liked: boolean) => {
    onLike?.(postId, liked);
  };

  return (
    <article 
      className="bg-background border-b border-border p-4 hover:bg-muted/30 transition-colors cursor-pointer relative"
      onClick={handlePostClick}
    >
      {/* SOLO il pulsante elimina in alto a destra - MODIFICA viene gestito in PostActions */}
      {isEditable && (
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(post.id);
            }}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted"
            title="Elimina post"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <PostHeader author={post.author} createdAt={post.createdAt} />
      <PostContent content={post.content} />
      <PostActions
        postId={post.id}
        initialLikes={post.likes}
        initialComments={post.comments}
        onLike={handleLike}
        onComment={onComment}
        isEditable={isEditable}
        onEdit={handleEdit} 
      />

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica post</DialogTitle>
            <DialogDescription>Puoi aggiornare il contenuto del tuo post qui sotto.</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <TextArea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={6} />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsEditOpen(false)} disabled={saving}>Annulla</Button>
            <Button onClick={() => saveEdit(post.id)} disabled={saving}>{saving ? "Salvataggio..." : "Salva"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Elimina post"
        description="Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata."
        onConfirm={executeDelete}
        confirmText={deleting ? "Eliminazione..." : "Elimina"}
        variant="destructive"
      />
    </article>
  );
}