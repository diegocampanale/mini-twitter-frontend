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

  // Controlla se c'è un utente salvato in sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Errore parsing user:", e);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Questa funzione non è usata direttamente - il login avviene tramite /login page
    // con chiamate API dirette (login + verifyOTP)
    throw new Error("Usa la pagina /login per l'autenticazione");
  };

  const signup = async (username: string, email: string, password: string) => {
    // Questa funzione non è usata direttamente - la registrazione avviene tramite /signup page
    // con chiamate API dirette
    throw new Error("Usa la pagina /signup per la registrazione");
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...updates };
    setUser(next);
    sessionStorage.setItem("user", JSON.stringify(next));
    
    // TODO: Implementare chiamata API per aggiornare il profilo sul backend
    // const token = sessionStorage.getItem('authToken');
    // await updateUser(user.id, updates, token);
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
