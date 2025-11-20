"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login, verifyOTP } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(username, password);
      
      if (result.requires_otp) {
        // STEP 1 completato: richiede OTP
        setTempToken(result.temp_token);
        setRequiresOTP(true);
      } else {
        // Login completato senza OTP
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
        // Usa window.location per forzare il reload del context
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Errore durante il login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await verifyOTP(tempToken, otpCode);
      
      if (result.success) {
        // STEP 2 completato: login riuscito
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
        // Usa window.location per forzare il reload del context
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setError(error.message || "Codice OTP non valido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 md:min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {requiresOTP ? "Verifica OTP" : "Accedi"}
          </CardTitle>
          <CardDescription className="text-center">
            {requiresOTP 
              ? "Inserisci il codice OTP da Google Authenticator" 
              : "Inserisci le tue credenziali per accedere"}
          </CardDescription>
        </CardHeader>

        {!requiresOTP ? (
          // STEP 1: Form username e password
          <form onSubmit={handleLoginSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full rounded-full" 
                disabled={isLoading}
              >
                {isLoading ? "Accesso in corso..." : "Continua"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Non hai un account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Registrati
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          // STEP 2: Form codice OTP
          <form onSubmit={handleOTPSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="otp">Codice OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Inserisci il codice a 6 cifre da Google Authenticator
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full rounded-full" 
                disabled={isLoading}
              >
                {isLoading ? "Verifica in corso..." : "Verifica e Accedi"}
              </Button>
              <Button 
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setRequiresOTP(false);
                  setTempToken("");
                  setOtpCode("");
                  setError("");
                }}
              >
                Torna indietro
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
