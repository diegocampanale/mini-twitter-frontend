// components/organisms/PostCard.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PostHeader from "@/components/molecules/PostHeader";
import PostContent from "@/components/molecules/PostContent";
import PostActions from "@/components/molecules/PostActions";
import CommentSection from "@/components/molecules/CommentSection";

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
  const [showComments, setShowComments] = useState(false);
  const router = useRouter();

  const handlePostClick = (e: React.MouseEvent) => {
    // Naviga alla pagina del post solo se non si clicca sui bottoni o sulla sezione commenti
    if (!(e.target as HTMLElement).closest('button') && 
        !(e.target as HTMLElement).closest('[data-comment-section]')) {
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
      />
      
      {/* Sezione commenti - non triggera la navigazione */}
      {showComments && (
        <div data-comment-section onClick={(e) => e.stopPropagation()}>
          <CommentSection postId={post.id} />
        </div>
      )}
    </article>
  );
}