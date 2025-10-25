// components/organisms/PostCard.tsx
"use client";

import React from "react";
import PostHeader from "@/components/molecules/PostHeader";
import PostContent from "@/components/molecules/PostContent";
import PostActions from "@/components/molecules/PostActions";

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
      />
    </article>
  );
}
