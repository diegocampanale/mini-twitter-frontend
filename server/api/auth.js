import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import speakeasy from 'speakeasy';
import { supabase } from '../db/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'Ej8tK4pX7mZ2qR9sV6bN3cF1hL5gD0aW';
const JWT_EXPIRES_IN = '24h';

// Middleware per verificare il token JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Registrazione utente
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }
    
    // Verifica se l'utente esiste già
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();
      
    if (existingUser) {
      return res.status(400).json({ error: 'Email o username già in uso' });
    }
    
    // Hash della password con salt esplicito
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Genera un OTP secret unico per questo utente
    const otpSecret = speakeasy.generateSecret({ length: 20 });
    
    // Crea il nuovo utente (salvando anche il salt)
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: hashedPassword,
        salt, // <-- aggiunto
        bio: null,
        otp_secret: otpSecret.base32
      })
      .select('*')
      .single();
    if (error) throw error;
    
    // Genera token JWT
    const token = jwt.sign({ id: data.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    // Risposta con otp_secret e salt inclusi
    res.status(201).json({
      user: {
        id: data.id,
        username: data.username,
        email: data.email
      },
      token,
      otp_secret: otpSecret.base32 // <-- aggiunto
    });
  } catch (err) {
    next(err);
  }
});

// STEP 1: Login con username e password
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password richiesti' });
    }
    
    // Trova l'utente
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error || !user) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    
    // Verifica la password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    
    // Se l'utente ha OTP configurato, richiedi la verifica OTP
    if (user.otp_secret) {
      // Genera un token temporaneo per il secondo step
      const tempToken = jwt.sign(
        { 
          id: user.id, 
          step: 'otp_pending',
          username: user.username
        }, 
        JWT_SECRET, 
        { expiresIn: '5m' } // Token temporaneo valido 5 minuti
      );
      
      return res.json({
        success: false,
        requires_otp: true,
        temp_token: tempToken,
        message: 'Inserisci il codice OTP per completare il login'
      });
    }
    
    // Se non ha OTP, genera direttamente il token finale
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
});

// STEP 2: Verifica OTP e completamento login
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { temp_token, otp_token } = req.body;
    
    if (!temp_token || !otp_token) {
      return res.status(400).json({ 
        error: 'Token temporaneo e codice OTP richiesti' 
      });
    }
    
    // Verifica il token temporaneo
    let decoded;
    try {
      decoded = jwt.verify(temp_token, JWT_SECRET);
      
      // Verifica che sia un token temporaneo per OTP
      if (decoded.step !== 'otp_pending') {
        return res.status(401).json({ error: 'Token non valido' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Token temporaneo scaduto o non valido' });
    }
    
    // Ottieni l'utente
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();
      
    if (error || !user) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }
    
    // Verifica il codice OTP
    const isValidOTP = speakeasy.totp.verify({
      secret: user.otp_secret,
      encoding: 'base32',
      token: otp_token,
      window: 2 // Permette una finestra di ±2 intervalli (60 secondi prima/dopo)
    });
    
    if (!isValidOTP) {
      return res.status(401).json({ error: 'Codice OTP non valido' });
    }
    
    // Genera il token JWT finale
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
});

// LOGOUT: invalida la sessione (JWT lato client)
router.post('/logout', authenticateJWT, async (req, res, next) => {
  try {
    // per ora rispondiamo solo con successo
    res.json({ success: true, message: 'Logout effettuato' });
  } catch (err) {
    next(err);
  }
});

// Ottieni informazioni OTP per configurazione
router.get('/otp/setup', authenticateJWT, async (req, res, next) => {
  try {
    // Ottieni l'utente con il suo otp_secret
    const { data: user, error } = await supabase
      .from('users')
      .select('otp_secret')
      .eq('id', req.user.id)
      .single();
      
    if (error) throw error;
    
    // Se non ha un OTP secret, generane uno nuovo
    let otpSecret = user.otp_secret;
    if (!otpSecret) {
      const secret = speakeasy.generateSecret({ length: 20 });
      otpSecret = secret.base32;
      
      // Salva il nuovo secret
      await supabase
        .from('users')
        .update({ otp_secret: otpSecret })
        .eq('id', req.user.id);
    }
    
    // Crea l'URL per il QR code
    const otpauth_url = speakeasy.otpauthURL({
      secret: otpSecret,
      label: `ProgettoRecluta:${req.user.email}`,
      issuer: 'ProgettoRecluta',
      algorithm: 'sha1'
    });
    
    res.json({
      secret: otpSecret,
      otpauth_url: otpauth_url
    });
  } catch (err) {
    next(err);
  }
});

// Verifica stato OTP
router.get('/otp/status', authenticateJWT, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('otp_secret')
      .eq('id', req.user.id)
      .single();
      
    if (error) throw error;
    
    res.json({
      has_otp: !!user.otp_secret,
      message: 'Stato OTP recuperato con successo'
    });
  } catch (err) {
    next(err);
  }
});

// Verifica token JWT
router.get('/me', authenticateJWT, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      has_otp: !!req.user.otp_secret,
      bio: req.user.bio
    }
  });
});

export default router;