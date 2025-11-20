// components/atoms/CommentList.tsx
"use client";

import React from "react";
import CommentItem from "./CommentItem";

export type CommentData = {
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

type CommentListProps = {
  comments: CommentData[];
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
  fullHeight?: boolean;
};

export default function CommentList({ 
  comments, 
  onLikeComment, 
  onDeleteComment,
  currentUserId,
  fullHeight 
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Ancora nessun commento. Sii il primo a commentare!
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div
        className={`space-y-3 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent ${
          fullHeight ? "" : "max-h-60 overflow-y-auto"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(100, 100, 100, 0.2) transparent",
        }}
      >
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onLike={onLikeComment}
            onDelete={onDeleteComment}
            canDelete={comment.user_id === currentUserId}
            
          />
        ))}
      </div>

      {!fullHeight && comments.length > 2 && (
        <div className="text-xs text-muted-foreground mt-2 text-center">
          {comments.length} commenti - Scorri per vedere tutti
        </div>
      )}
    </div>
  );
}