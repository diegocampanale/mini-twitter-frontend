"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app we'd call backend; here we update local context/localStorage
      await updateProfile({ username, bio });
      router.push("/profile");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Modifica profilo</h1>
        <form onSubmit={handleSave} className="space-y-4 bg-card border border-border rounded-lg p-6">
          <div>
            <label className="text-sm text-muted-foreground">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent border border-border rounded-md p-2 mt-1"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              Salva
            </Button>
            <Button variant="secondary" onClick={() => router.push("/profile")}>Annulla</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
