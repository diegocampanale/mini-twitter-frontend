// components/organisms/PostCard.tsx
"use client";

import React from "react";
import PostHeader from "@/components/molecules/PostHeader";
import PostContent from "@/components/molecules/PostContent";
import PostActions from "@/components/molecules/PostActions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import TextArea from "@/components/atoms/TextArea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
};

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
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
      setIsEditOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore durante l'aggiornamento");
    } finally {
      setSaving(false);
    }
  };
  return (
    <article className="bg-background border-b border-border p-4 hover:bg-muted/30 transition-colors cursor-pointer">
      <PostHeader author={post.author} createdAt={post.createdAt} />
      <PostContent content={post.content} />
      <PostActions
        postId={post.id}
        initialLikes={post.likes}
        initialComments={post.comments}
        onLike={onLike}
        onComment={onComment}
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
    </article>
  );
}
