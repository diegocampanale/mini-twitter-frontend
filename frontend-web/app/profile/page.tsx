
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import PostCard from "@/components/organisms/PostCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LikedPostsFeed from "@/components/organisms/LikedPostsFeed";
import UserCommentsFeed from "@/components/organisms/CommentedPostsFeed";
import { getUserStats } from "@/lib/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    postsCount: 0,
    commentsCount: 0,
    likesCount: 0
  });

  // Carica i post dell'utente
  useEffect(() => {
    async function loadPosts() {
      try {
        const { getPosts } = await import("@/lib/api");
        const data = await getPosts();
        const mine = data.filter((p: any) => p.author?.username === user?.username);
        setPosts(mine);
      } catch (err) {
        console.error(err);
      }
    }
    if (user) loadPosts();
  }, [user]);

  // Carica le statistiche
  useEffect(() => {
    async function loadStats() {
      if (!user?.id) return;
      
      try {
        const userStats = await getUserStats(user.id);
        // Merge the fetched stats into the existing state so required fields
        // like commentsCount are preserved if they are missing from the response.
        setStats(prev => ({ ...prev, ...userStats }));
      } catch (err) {
        console.error('Errore nel caricamento statistiche:', err);
      }
    }
    if (user) loadStats();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Profilo</h1>

        <Card>
          <CardHeader>
            <CardTitle>Informazioni utente</CardTitle>
            <CardDescription>I tuoi dati personali</CardDescription>
          </CardHeader>

         
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Username</p>
            <p className="text-lg">@{user?.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg">{user?.email}</p>
          </div>
        
          <div>
            <p className="text-sm font-medium text-muted-foreground">Bibliografia/Bio</p>
            <p className="text-lg">
              {user?.bio || (
                <span className="text-muted-foreground italic">
                  Nessuna bio aggiunta. 
                  <button 
                    onClick={() => router.push("/profile/edit")}
                    className="text-primary hover:underline ml-1"
                  >
                    Aggiungine una!
                  </button>
                </span>
              )}
            </p>
          </div>
        </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={() => router.push("/profile/edit")}
              className="w-full rounded-full flex items-center gap-2"
            >
              <Edit className="h-5 w-5" />
              Modifica profilo
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full rounded-full flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Esci dall'account
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-background border-b border-muted-foreground/20">
              <TabsTrigger value="posts">
                Post ({stats.postsCount})
              </TabsTrigger>
              <TabsTrigger value="comments">
                Commenti ({stats.commentsCount})
              </TabsTrigger>
              <TabsTrigger value="likes">
                Mi piace ({stats.likesCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {posts.length > 0 ? (
                posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))
              ) : (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  Non hai ancora pubblicato post.
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <UserCommentsFeed />
            </TabsContent>

            <TabsContent value="likes">
              <LikedPostsFeed />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}