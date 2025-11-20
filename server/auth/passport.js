import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { supabase } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'Ej8tK4pX7mZ2qR9sV6bN3cF1hL5gD0aW';

// Configurazione della strategia JWT
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    if (payload.step === 'otp_pending') {
      return done(null, false, { message: 'Token temporaneo non valido per questa operazione' });
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.id)
      .single();
    if (error || !data) return done(null, false, { message: 'Utente non trovato' });
    return done(null, data);
  } catch (err) {
    return done(err, false);
  }
}));

export const authenticateJWT = passport.authenticate('jwt', { session: false });
export default passport;