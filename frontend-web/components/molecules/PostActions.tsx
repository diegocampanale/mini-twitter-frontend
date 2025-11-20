
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Icon from "@/components/atoms/Icon";
import { useAuth } from "@/contexts/AuthContext";
import { getLikes, toggleLike, getComments } from "@/lib/api";
import { Trash2 } from "lucide-react";

type PostActionsProps = {
  postId: string;
  initialLikes?: number;
  initialComments?: number;
  onLike?: (postId: string, liked: boolean) => void; 
  onComment?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  isEditable?: boolean;
  onEdit?: (postId: string) => void;
  showDelete?: boolean;
};

export default function PostActions({
  postId,
  initialLikes = 0,
  initialComments = 0,
  onLike,
  onComment,
  onDelete,
  isEditable = false,
  onEdit,
  showDelete = false,
}: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter(); 

  // Carica lo stato del like all'avvio
  useEffect(() => {
    const checkUserLike = async () => {
      if (!user?.id) return;
      
      try {
        const data = await getLikes(postId, { userId: user.id });
        setLiked(data.items && data.items.length > 0);
        
        const countData = await getLikes(postId, { count: true });
        setLikes(countData.count || 0);
      } catch (error) {
        console.error("Errore nel caricamento dei like:", error);
      }
    };

    checkUserLike();
  }, [postId, user?.id]);


  useEffect(() => {
    const loadCommentsCount = async () => {
      try {
        const commentsData = await getComments(postId);
        setCommentsCount(commentsData.items?.length || 0);
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error);
      }
    };

    loadCommentsCount();
  }, [postId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated || !user?.id) {
      alert("Devi essere loggato per mettere like");
      return;
    }

    try {
      const newLikedState = !liked;
      
      setLiked(newLikedState);
      setLikes(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
      
      await toggleLike(postId, user.id);
      
      onLike?.(postId, newLikedState);
    } catch (error) {
      setLiked(!liked);
      setLikes(prev => liked ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    router.push(`/post/${postId}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(postId);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Bottone Like */}
      <button
        onClick={handleLike}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group"
        aria-label="Mi piace"
        disabled={!isAuthenticated}
      >
        <Icon
          name="heart"
          size={18}
          className={liked ? "fill-red-500 text-red-500" : "group-hover:text-red-500"}
        />
        {likes > 0 && <span className="text-xs min-w-[16px]">{likes}</span>}
      </button>

      {/* Bottone Commenti - SEMPRE reindirizza alla pagina del post */}
      <button
        onClick={handleComment}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Commenta"
      >
        <Icon name="comment" size={18} />
        {commentsCount > 0 && <span className="text-xs min-w-[16px]">{commentsCount}</span>}
      </button>

      {/* Bottone Modifica */}
      {isEditable && (
        <button
          onClick={() => onEdit?.(postId)}
          className="ml-auto text-sm text-muted-foreground hover:text-primary transition-colors"
          aria-label="Modifica"
        >
          <Icon name="edit" size={16} />
        </button>
      )}

      {/* Bottone Elimina */}
      {showDelete && (
        <button
          onClick={handleDelete}
          className="ml-auto text-sm text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Elimina"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}