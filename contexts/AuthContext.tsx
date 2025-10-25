"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Controlla se c'è un utente salvato in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Chiamata API reale
    console.log("Login:", { email, password });
    
    // Mock user
    const mockUser: User = {
      id: "1",
      username: email.split("@")[0],
      email,
      bio: "Utente mock",
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const signup = async (username: string, email: string, password: string) => {
    // TODO: Chiamata API reale
    console.log("Signup:", { username, email, password });
    
    // Mock user
    const mockUser: User = {
      id: "1",
      username,
      email,
      bio: "",
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const prevUsername = user.username;
    const next = { ...user, ...updates };
    setUser(next);
    localStorage.setItem("user", JSON.stringify(next));

    // If username changed, update posts authored by the previous username
    if (updates.username && updates.username !== prevUsername) {
      try {
        await fetch("/api/posts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldUsername: prevUsername, newUsername: updates.username }),
        });
      } catch (err) {
        console.error("Errore aggiornamento author nei post:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
