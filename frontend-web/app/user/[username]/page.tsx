
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Avatar from "@/components/atoms/Avatar";
import PostCard from "@/components/organisms/PostCard";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  created_at: string;
  avatar?: string;
}

interface Post {
  id: string;
  author: { 
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  user_id?: string;
  likes?: number;
  comments?: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const username = params.username as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    postsCount: 0,
    commentsCount: 0,
    likesCount: 0
  });

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
      
        const { getUserByUsername, getPosts, getUserStats } = await import("@/lib/api");
 
        const userData = await getUserByUsername(username);
        setUser(userData);
        
     
        const allPosts = await getPosts();
        const userPosts = allPosts.filter((post: Post) => post.author?.username === username);
        setPosts(userPosts);
        
     
        if (userData.id) {
          const userStats = await getUserStats(userData.id);
          setStats(userStats);
        }
      } catch (err) {
        console.error("Errore nel caricamento profilo:", err);
        setUser(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadUserData();
    }
  }, [username]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto p-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Caricamento profilo...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto p-4">
          <Card>
            <CardContent className="py-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Utente non trovato</h2>
              <p className="text-muted-foreground">
                L'utente @{username} non esiste.
              </p>
              <Button onClick={handleBack} className="mt-4">
                Torna indietro
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="bg-background min-h-screen">
      <div className="container max-w-2xl mx-auto">
        {/* Header con back button */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">{user.username}</h1>
              <p className="text-xs text-muted-foreground">{stats.postsCount} post</p>
            </div>
          </div>
        </div>

        {/* Profilo utente */}
        <div className="px-4 pt-6 pb-4">
          {/* Solo Avatar senza pulsanti */}
          <div className="flex justify-center mb-4">
            <Avatar 
              username={user.username} 
              src={user.avatar} 
              size="lg"
            />
          </div>

          {/* Username e info */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-muted-foreground">@{username}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-foreground text-center mb-4">{user.bio}</p>
          )}

          {/* Join date */}
          <p className="text-sm text-muted-foreground text-center mb-4">
            Si è unito il {joinDate}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="font-bold text-lg">{stats.postsCount}</div>
              <div className="text-sm text-muted-foreground">Post</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.commentsCount}</div>
              <div className="text-sm text-muted-foreground">Commenti</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.likesCount}</div>
              <div className="text-sm text-muted-foreground">Mi piace</div>
            </div>
          </div>
        </div>

        {/* Solo Tab Post */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full rounded-none border-b border-border bg-background p-0">
            <TabsTrigger 
              value="posts"
              className="w-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
            >
              Post ({stats.postsCount})
            </TabsTrigger>
          </TabsList>

          {/* Tab Post */}
          <TabsContent value="posts" className="m-0">
            {posts.length > 0 ? (
              <div className="divide-y divide-border">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      author: post.author,
                      content: post.content,
                      createdAt: post.createdAt,
                      user_id: post.user_id,
                      likes: post.likes,
                      comments: post.comments,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="m-4">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Nessun post pubblicato
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}