"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
          <CardFooter>
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
      </div>
    </main>
  );
}
