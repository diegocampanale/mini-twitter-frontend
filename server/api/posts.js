// server/api/posts.js
import { Router } from 'express';
import { supabase } from '../db/index.js';
import { authenticateJWT } from '../auth/passport.js';

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

// GET /posts?limit=&offset=&user_id=
router.get('/', async (req, res, next) => {
  try {
    const { limit, offset } = paginated(req);
    const userId = req.query.user_id;

    let query = supabase
      .from('posts')
      .select('*, users!inner(id, username)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) query = query.eq('user_id', userId);

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ items: data, count, limit, offset });
  } catch (err) { next(err); }
});

// GET /posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(id, username)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
});

// POST /posts
router.post('/', authenticateJWT, async (req, res, next) => {
  try {
    // user_id dal JWT, non dal body
    const user_id = req.user.id;
    requireFields(req.body, ['content']);
    const payload = { user_id, content: req.body.content };
    const { data, error } = await supabase.from('posts').insert(payload).select('*').single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) { next(err); }
});

router.patch('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const updates = {};
    if ('content' in req.body) updates.content = req.body.content;
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });
    // opzionale: verifica che il post appartenga all’utente loggato
    const { data: post } = await supabase.from('posts').select('user_id').eq('id', req.params.id).single();
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { data, error } = await supabase.from('posts').update(updates).eq('id', req.params.id).select('*').single();
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticateJWT, async (req, res, next) => {
  try {
    // stesso controllo proprietà
    const { data: post } = await supabase.from('posts').select('user_id').eq('id', req.params.id).single();
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { error } = await supabase.from('posts').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
