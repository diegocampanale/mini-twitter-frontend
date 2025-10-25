"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Avatar from "@/components/atoms/Avatar";
import PostCard from "@/components/organisms/PostCard";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  created_at: string;
}

interface Post {
  id: string;
  author: { username: string };
  content: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Carica utente (mock) e post reali dall'API
    const mockUser: User = {
      id: "1",
      username: username,
      email: `${username}@example.com`,
      bio: "Wargamer and Book-Dragon",
      created_at: new Date(2024, 0, 15).toISOString(),
    };

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Errore caricamento posts");
        const data: Post[] = await res.json();
        // Filtra i post dell'utente richiesto
        const userPosts = data.filter((p) => p.author?.username === username);
        setUser(mockUser);
        setPosts(userPosts);
      } catch (err) {
        console.error(err);
        setUser(mockUser);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto p-4">
          <p className="text-center text-muted-foreground">Caricamento...</p>
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
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  // Stats mock
  const stats = {
    followers: 358,
    following: 634,
    posts: posts.length,
  };

  return (
    <main className="bg-background">
      <div className="container max-w-2xl mx-auto">
        {/* Header con back button */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">@{user.username}</h1>
              <p className="text-xs text-muted-foreground">{stats.posts} post</p>
            </div>
          </div>
        </div>

        {/* Profilo utente */}
        <div className="px-4 pt-4">
          {/* Avatar e bottone Segui */}
          <div className="flex items-start justify-between mb-4">
            <Avatar username={user.username} size="lg" />
            <Button
              onClick={() => setIsFollowing(!isFollowing)}
              variant={isFollowing ? "outline" : "default"}
              className="rounded-full px-6"
            >
              {isFollowing ? "Seguito" : "Segui"}
            </Button>
          </div>

          {/* Username e handle */}
          <div className="mb-3">
            <h2 className="text-xl font-bold">{username}</h2>
            <p className="text-sm text-muted-foreground">@{username}.jetop.social</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-3">
            <div>
              <span className="font-semibold">{stats.followers}</span>{" "}
              <span className="text-muted-foreground text-sm">follower</span>
            </div>
            <div>
              <span className="font-semibold">{stats.following}</span>{" "}
              <span className="text-muted-foreground text-sm">seguiti</span>
            </div>
            <div>
              <span className="font-semibold">{stats.posts}</span>{" "}
              <span className="text-muted-foreground text-sm">post</span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-foreground mb-4">{user.bio}</p>
          )}
        </div>

        {/* Tabs per post, commenti, likes */}
        <Tabs defaultValue="posts" className="w-full">
          {/* container con linea sottile */}
          <TabsList className="grid w-full grid-cols-3 border-b border-muted rounded-none p-0 bg-background">
            {/* trigger compatte, centrate, con bordo inferiore sottile visibile solo quando attive */}
            <TabsTrigger
              value="posts"
              className="flex items-center justify-center text-sm sm:text-base py-2 border-b-2 border-transparent rounded-none bg-background data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              Post
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="flex items-center justify-center text-sm sm:text-base py-2 border-b-2 border-transparent rounded-none bg-background data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              Commenti
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex items-center justify-center text-sm sm:text-base py-2 border-b-2 border-transparent rounded-none bg-background data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              Mi piace
            </TabsTrigger>
          </TabsList>

          {/* Tab Post */}
          <TabsContent value="posts" className="space-y-0">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    author: post.author,
                    content: post.content,
                    createdAt: post.createdAt,
                  }}
                />
              ))
            ) : (
              <Card >
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Nessun post pubblicato
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Commenti */}
          <TabsContent value="comments" className="p-4">
            <Card className="">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nessun commento ancora
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  I commenti di @{user.username} appariranno qui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Likes */}
          <TabsContent value="likes" className="p-4">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nessun mi piace ancora
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  I post piaciuti da @{user.username} appariranno qui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
