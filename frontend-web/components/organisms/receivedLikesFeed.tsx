
"use client";

import React, { useEffect, useState } from "react";
import PostCard, { PostData } from "@/components/organisms/PostCard";
import { getReceivedLikes, getUsers } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type ReceivedLike = {
  post: PostData;
  likes: any[];
  totalReceivedLikes: number;
  likersInfo?: string[]; 
};

export default function ReceivedLikesFeed() {
  const [receivedLikes, setReceivedLikes] = useState<ReceivedLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  async function loadReceivedLikes() {
    if (!user?.id) {
      setError("Devi essere loggato per vedere i like ricevuti");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await getReceivedLikes(user.id);
      
      
      const enrichedData = await Promise.all(
        data.map(async (item: ReceivedLike) => {
          try {
            
            const likersInfo = await Promise.all(
              item.likes.slice(0, 5).map(async (like: any) => {
                try {
                  const userInfo = await getUsers(like.user_id);
                  return userInfo.username || 'Utente';
                } catch {
                  return 'Utente';
                }
              })
            );
            
            return {
              ...item,
              likersInfo 
            };
          } catch (error) {
            console.error('Errore nell\'arricchimento dati:', error);
            return { ...item, likersInfo: [] };
          }
        })
      );
      
      setReceivedLikes(enrichedData);
    } catch (e) {
      console.error("Errore nel caricamento dei like ricevuti:", e);
      setError(e instanceof Error ? e.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReceivedLikes();
  }, [user?.id]);

  const handleLike = async (postId: string, liked: boolean) => {
  
    await loadReceivedLikes();
  };

  const handleComment = async (postId: string) => {
    console.log("Apertura commenti per post:", postId);
  };

  const handleShare = async (postId: string) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiato negli appunti!");
    } catch {
      alert("Copia non riuscita");
    }
  };


  const formatLikersText = (likersInfo: string[] = [], totalLikes: number) => {
    if (likersInfo.length === 0) return `${totalLikes} persone hanno messo mi piace al tuo post`;
    
    if (likersInfo.length === 1) {
      return `${likersInfo[0]} ha messo mi piace al tuo post`;
    } else if (likersInfo.length === 2) {
      return `${likersInfo[0]} e ${likersInfo[1]} hanno messo mi piace al tuo post`;
    } else if (likersInfo.length === 3) {
      return `${likersInfo[0]}, ${likersInfo[1]} e ${likersInfo[2]} hanno messo mi piace al tuo post`;
    } else {
      const othersCount = totalLikes - 3;
      return `${likersInfo[0]}, ${likersInfo[1]}, ${likersInfo[2]} e altri ${othersCount} hanno messo mi piace al tuo post`;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Devi essere loggato per vedere i like ricevuti.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {loading && (
        <div className="text-center text-sm text-muted-foreground py-8">
          Caricamento like ricevuti...
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-destructive py-8 border-y border-destructive/20 bg-destructive/5 px-4 mx-4">
          Errore: {error}
        </div>
      )}

      {!loading && !error && receivedLikes.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <p className="text-lg mb-2">Ancora nessun like ricevuto</p>
            <p className="text-sm">I like che ricevi ai tuoi post appariranno qui.</p>
          </div>
        </div>
      )}

      {!loading && !error && receivedLikes.map((item, index) => (
        <div key={item.post.id || index} className="mb-6">
          {/* Header con informazioni sui like */}
          <div className="mb-3 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                {(item.likersInfo || []).slice(0, 3).map((username, idx) => (
                  <div 
                    key={idx}
                    className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium border-2 border-background"
                    title={username}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>
                ))}
                {item.totalReceivedLikes > 3 && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium border-2 border-background">
                    +{item.totalReceivedLikes - 3}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {formatLikersText(item.likersInfo, item.totalReceivedLikes)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.totalReceivedLikes} mi piace totale
                </p>
              </div>
            </div>
          </div>

          {/* Il post */}
          <PostCard
            post={item.post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        </div>
      ))}
    </div>
  );
}