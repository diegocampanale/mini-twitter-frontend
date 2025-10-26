// components/molecules/PostActions.tsx
"use client";

import React, { useState } from "react";
import Icon from "@/components/atoms/Icon";

type PostActionsProps = {
  postId: string;
  initialLikes?: number;
  initialComments?: number;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
};

export default function PostActions({
  postId,
  initialLikes = 0,
  initialComments = 0,
  onLike,
  onComment,
}: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ferma la navigazione del post
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    onLike?.(postId);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ferma la navigazione del post
    onComment?.(postId); // Questo apre/chiude i commenti inline
  };

  return (
    <div className="flex items-center gap-4 pt-2 border-t border-border/50 mt-3">
      <button
        onClick={handleLike}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group"
        aria-label="Mi piace"
      >
        <Icon
          name="heart"
          size={18}
          className={liked ? "fill-red-500 text-red-500" : "group-hover:text-red-500"}
        />
        {likes > 0 && <span className="text-xs">{likes}</span>}
      </button>

      <button
        onClick={handleComment}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Commenta"
      >
        <Icon name="comment" size={18} />
        {initialComments > 0 && <span className="text-xs">{initialComments}</span>}
      </button>
    </div>
  );
}