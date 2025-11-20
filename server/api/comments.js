// server/api/comments.js
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

// GET /comments?post_id=&limit=&offset=
router.get('/', async (req, res, next) => {
  try {
    const { limit, offset } = paginated(req);
    const postId = req.query.post_id;
    let query = supabase
      .from('comments')
      .select('*, users(id, username)', { count: 'exact' })
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (postId) query = query.eq('post_id', postId);

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ items: data, count, limit, offset });
  } catch (err) { next(err); }
});

// GET /comments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, users(id, username), posts(id)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
});

// POST /comments
router.post('/', authenticateJWT, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    requireFields(req.body, ['post_id', 'content']);
    const payload = { post_id: req.body.post_id, user_id, content: req.body.content };
    const { data, error } = await supabase.from('comments').insert(payload).select('*').single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) { next(err); }
});

router.patch('/:id', authenticateJWT, async (req, res, next) => {
  try {
    if (!('content' in req.body)) return res.status(400).json({ error: 'No fields to update' });
    const { data: comment } = await supabase.from('comments').select('user_id').eq('id', req.params.id).single();
    if (!comment) return res.status(404).json({ error: 'Not found' });
    if (comment.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { data, error } = await supabase.from('comments').update({ content: req.body.content }).eq('id', req.params.id).select('*').single();
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const { data: comment } = await supabase.from('comments').select('user_id').eq('id', req.params.id).single();
    if (!comment) return res.status(404).json({ error: 'Not found' });
    if (comment.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { error } = await supabase.from('comments').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
