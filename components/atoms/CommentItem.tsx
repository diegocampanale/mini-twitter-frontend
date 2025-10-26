// components/molecules/CommentItem.tsx
"use client";

import React, { useState } from "react";
import Avatar from "@/components/atoms/Avatar";
import Timestamp from "@/components/atoms/Timestamp";
import Icon from "@/components/atoms/Icon";
import { CommentData } from "./CommentList";

type CommentItemProps = {
  comment: CommentData;
  onLike?: (commentId: string) => void;
};

export default function CommentItem({ comment, onLike }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    onLike?.(comment.id);
  };

  return (
    <div className="flex gap-3">
      <Avatar 
        username={comment.author.username} 
        src={comment.author.avatar} 
        size="sm" 
      />
      
      <div className="flex-1 min-w-0">
        <div className="bg-muted/50 rounded-lg p-3">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">
              {comment.author.username}
            </span>
            <Timestamp date={comment.createdAt} />
          </div>

          {/* Content */}
          <p className="text-sm text-foreground mb-2">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group text-xs"
              aria-label="Mi piace"
            >
              <Icon
                name="heart"
                size={14}
                className={liked ? "fill-red-500 text-red-500" : "group-hover:text-red-500"}
              />
              {likes > 0 && <span>{likes}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}