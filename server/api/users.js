// server/api/users.js
import { Router } from 'express';
import { supabase } from '../db/index.js';

const router = Router();

const requireFields = (obj, fields) => {
  const missing = fields.filter(f => obj?.[f] == null || obj[f] === '');
  if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }
};

const paginated = (req) => {
  const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 100);
  const offset = Math.max(parseInt(req.query.offset ?? '0', 10), 0);
  return { limit, offset };
};

// GET /users?limit=&offset=&q=
router.get('/', async (req, res, next) => {
  try {
    const { limit, offset } = paginated(req);
    const q = req.query.q?.trim();

    let query = supabase.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    if (q) {
      // filtro semplice su username OR email
      query = query.ilike('username', `%${q}%`).ilike('email', `%${q}%`);
      // supabase-js non supporta direttamente OR in chain: alternativa con rpc o 2 query.
      // Per semplicità: solo username; se vuoi OR, togli la riga sopra e fai una RPC.
      query = supabase.from('users')
        .select('*', { count: 'exact' })
        .or(`username.ilike.%${q}%,email.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ items: data, count, limit, offset });
  } catch (err) { next(err); }
});

// GET /users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
});

// POST /users
router.post('/', async (req, res, next) => {
  try {
    requireFields(req.body, ['username', 'email', 'password_hash']);
    const payload = {
      username: req.body.username,
      email: req.body.email,
      password_hash: req.body.password_hash,
      bio: req.body.bio ?? null
    };
    const { data, error } = await supabase.from('users').insert(payload).select('*').single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) { next(err); }
});

// PATCH /users/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {};
    ['username', 'email', 'password_hash', 'bio'].forEach(k => {
      if (k in req.body) updates[k] = req.body[k];
    });
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });

    const { data, error } = await supabase.from('users').update(updates).eq('id', req.params.id).select('*').single();
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
});

// DELETE /users/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
