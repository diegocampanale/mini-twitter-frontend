
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
};

type CommentListProps = {
  comments: CommentData[];
  onLikeComment?: (commentId: string) => void;
  fullHeight?: boolean;
};

export default function CommentList({ comments, onLikeComment, fullHeight }: CommentListProps) {
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
          // if fullHeight is true we don't limit height and let comments flow to page bottom
          fullHeight ? "" : "max-h-60 overflow-y-auto"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(100, 100, 100, 0.2) transparent",
        }}
      >
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLike={onLikeComment} />
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