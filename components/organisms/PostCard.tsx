// components/organisms/PostCard.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PostHeader from "@/components/molecules/PostHeader";
import PostContent from "@/components/molecules/PostContent";
import PostActions from "@/components/molecules/PostActions";
import CommentSection from "@/components/molecules/CommentSection";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import TextArea from "@/components/atoms/TextArea";
import { Button } from "@/components/ui/button";

export type PostData = {
  id: string;
  author?: {
    username?: string;
    avatar?: string;
  };
  content: string;
  createdAt?: string;
  likes?: number;
  comments?: number;
};

type PostCardProps = {
  post: PostData;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  // when true, clicking the post won't navigate (useful on single-post page)
  disableNavigation?: boolean;
  // callback invoked after the post was updated on the server
  onUpdated?: (post: PostData) => void;
};

export default function PostCard({ post, onLike, onComment, onShare, disableNavigation, onUpdated }: PostCardProps) {
  const auth = useAuth();
  const router = useRouter();
  const isEditable = !!(auth.user && post.author && auth.user.username === post.author.username);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);

  const handleEdit = (postId: string) => {
    setEditContent(post.content);
    setIsEditOpen(true);
  };

  const saveEdit = async (postId: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, content: editContent }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "Impossibile aggiornare il post");
      }
      const updated = await res.json();
      // If parent provided a callback, notify it so it can update its state
      if (onUpdated) {
        onUpdated(updated as PostData);
      } else {
        // fallback: refresh the current router so server data is re-fetched
        router.refresh();
      }
      setIsEditOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore durante l'aggiornamento");
    } finally {
      setSaving(false);
    }
  };
  const [showComments, setShowComments] = useState(false);
  

  const handlePostClick = (e: React.MouseEvent) => {
    // Naviga alla pagina del post solo se non si clicca sui bottoni o sulla sezione commenti
    // and navigation isn't disabled (single-post view)
    if (disableNavigation) return;
    // If click lands on an anchor (links to user or external links), let the link handle it
    if ((e.target as HTMLElement).closest('a')) return;

    if (
      !(e.target as HTMLElement).closest('button') &&
      !(e.target as HTMLElement).closest('[data-comment-section]')
    ) {
      router.push(`/post/${post.id}`);
    }
  };

  const handleCommentClick = (postId: string) => {
    setShowComments(!showComments);
    onComment?.(postId);
  };

  return (
    <article 
      className="bg-background border-b border-border p-4 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={handlePostClick}
    >
      <PostHeader author={post.author} createdAt={post.createdAt} />
      <PostContent content={post.content} />
      <PostActions
        postId={post.id}
        initialLikes={post.likes}
        initialComments={post.comments}
        onLike={onLike}
        onComment={handleCommentClick}
        isEditable={isEditable}
        onEdit={handleEdit}
      />

      {/* Edit dialog */}
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
      
      {/* Sezione commenti - non triggera la navigazione */}
      {showComments && (
        <div data-comment-section onClick={(e) => e.stopPropagation()}>
          <CommentSection postId={post.id} />
        </div>
      )}
    </article>
  );
}