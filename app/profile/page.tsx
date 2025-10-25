"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import PostCard from "@/components/organisms/PostCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        const mine = data.filter((p: any) => p.author?.username === user?.username);
        setPosts(mine);
      } catch (err) {
        console.error(err);
      }
    }
    if (user) load();
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
            {user?.bio && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bio</p>
                <p className="text-lg">{user.bio}</p>
              </div>
            )}
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
              <TabsTrigger value="posts">Post ({posts.length})</TabsTrigger>
              <TabsTrigger value="comments">Commenti (0)</TabsTrigger>
              <TabsTrigger value="likes">Mi piace (0)</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {posts.length > 0 ? (
                posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))
              ) : (
                <div className="text-sm text-muted-foreground py-6 text-center">Non hai ancora pubblicato post.</div>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <div className="text-sm text-muted-foreground py-6 text-center">I tuoi commenti appariranno qui.</div>
            </TabsContent>

            <TabsContent value="likes">
              <div className="text-sm text-muted-foreground py-6 text-center">I tuoi post preferiti appariranno qui.</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
