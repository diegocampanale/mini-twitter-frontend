"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signup } from "@/lib/api";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpData, setOtpData] = useState<{secret: string; otpauth_url: string} | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    if (formData.password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(formData.username, formData.email, formData.password);

      // Genera otpauth_url e QR code direttamente in frontend
      const otpauth_url = `otpauth://totp/ProgettoRecluta:${result.user.username}?secret=${result.otp_secret}&issuer=ProgettoRecluta&algorithm=SHA1&digits=6&period=30`;
      setOtpData({
        secret: result.otp_secret,
        otpauth_url
      });
    } catch (error: any) {
      // Messaggio gentile inline, senza console.error/alert
      const msg = (error?.message || "Errore durante la registrazione").toString();
      if (msg.toLowerCase().includes("gia") || msg.toLowerCase().includes("già") || msg.toLowerCase().includes("in uso")) {
        setError("Questo username o email è già registrato. Prova ad accedere oppure scegli un altro username/email.");
      } else {
        setError("Registrazione non riuscita. Riprova tra poco.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToLogin = () => {
    window.location.href = "/login";
  };

  const handleCopySecret = () => {
    if (otpData) {
      navigator.clipboard.writeText(otpData.secret);
      alert("Secret copiato negli appunti!");
    }
  };

  // Mostra schermata con info OTP dopo registrazione
  if (otpData) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpData.otpauth_url)}`;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Registrazione completata! 🎉
            </CardTitle>
            <CardDescription className="text-center">
              Configura l'autenticazione a due fattori
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Nota:</strong> Questo progetto usa un secret OTP condiviso per tutti gli utenti. 
                Configura Google Authenticator una sola volta e potrai accedere con qualsiasi account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Passo 1: Installa Google Authenticator</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>iPhone: <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" className="text-primary hover:underline">App Store</a></li>
                <li>Android: <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" className="text-primary hover:underline">Google Play</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Passo 2: Scansiona il QR Code</h3>
              <div className="flex justify-center my-4">
                <img src={qrCodeUrl} alt="QR Code OTP" className="border rounded" />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Oppure inserisci manualmente il secret:
              </p>
            </div>

            <div>
              <Label>Secret OTP</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  value={otpData.secret} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCopySecret}
                >
                  Copia
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleContinueToLogin}
              className="w-full"
            >
              Continua al Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crea un account</CardTitle>
          <CardDescription className="text-center">
            Inserisci i tuoi dati per registrarti
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full rounded-full" 
              disabled={isLoading}
            >
              {isLoading ? "Registrazione in corso..." : "Crea account"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Hai già un account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Accedi
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
