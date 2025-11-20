"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getOTPSetup, getOTPStatus } from "@/lib/api";

export default function OTPSetupPage() {
  const [otpSecret, setOtpSecret] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();

  useEffect(() => {
    const shared = process.env.NEXT_PUBLIC_SHARED_OTP_SECRET;
    // Se c'è un token, verifica lo stato OTP lato backend
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;
    if (token) {
      getOTPStatus(token).then((st) => {
        if (shared && st?.has_otp) {
          setNotice("Attenzione: il tuo account ha già un OTP configurato lato server. Se usi il secret condiviso, assicurati che il database sia allineato allo stesso secret.");
        }
      }).catch(() => {/* ignora */});
    }

    if (shared && shared.length > 0) {
      // Usa il secret condiviso dalla configurazione
      setOtpSecret(shared);
      const otpauthUrl = `otpauth://totp/ProgettoRecluta:account?secret=${shared}&issuer=ProgettoRecluta&algorithm=SHA1&digits=6&period=30`;
      setQrCodeUrl(otpauthUrl);
      setIsLoading(false);
    } else {
      // Fallback: recupera dal backend
      loadOTPSetup();
    }
  }, []);

  const loadOTPSetup = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const data = await getOTPSetup(token);
      setOtpSecret(data.secret);
      setQrCodeUrl(data.otpauth_url);
    } catch (error: any) {
      console.error("Error loading OTP setup:", error);
      setError(error.message || "Errore nel caricamento delle informazioni OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(otpSecret);
    alert("Secret copiato negli appunti!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Configura Autenticazione a Due Fattori
          </CardTitle>
          <CardDescription className="text-center">
            Proteggi il tuo account con Google Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          {notice && (
            <div className="p-3 text-sm text-amber-700 bg-amber-50 rounded-md">
              {notice}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Passo 1: Installa Google Authenticator</h3>
              <p className="text-sm text-muted-foreground">
                Scarica l&apos;app Google Authenticator sul tuo smartphone:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                <li>iPhone: <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" className="text-primary hover:underline">App Store</a></li>
                <li>Android: <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" className="text-primary hover:underline">Google Play</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Passo 2: Scansiona il QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Apri Google Authenticator e scansiona questo QR code:
              </p>
              {qrCodeUrl && (
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                    alt="QR Code per OTP"
                    className="w-48 h-48"
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Oppure inserisci manualmente il secret:</h3>
              <div className="flex gap-2">
                <Input
                  value={otpSecret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopySecret}
                >
                  Copia
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Usa questo codice se non riesci a scansionare il QR code
              </p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Passo 3: Verifica la configurazione (opzionale)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Inserisci il codice a 6 cifre mostrato nell&apos;app per verificare che funzioni:
              </p>
              <div className="space-y-2">
                <Label htmlFor="otp">Codice OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full rounded-full" 
            onClick={handleSkip}
          >
            Completa configurazione
          </Button>
          <Button 
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleSkip}
          >
            Salta per ora
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Potrai configurare l&apos;autenticazione a due fattori in seguito dalle impostazioni del profilo
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
