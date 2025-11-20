// server/api/likes.js
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

// GET /likes?post_id=&user_id=&count=true
router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('likes').select('*', { count: 'exact' });
    if (req.query.post_id) query = query.eq('post_id', req.query.post_id);
    if (req.query.user_id) query = query.eq('user_id', req.query.user_id);

    const { data, error, count } = await query;
    if (error) throw error;
    if (req.query.count === 'true') return res.json({ count });
    res.json({ items: data, count });
  } catch (err) { next(err); }
});

// POST /likes  { post_id, user_id }
router.post('/', authenticateJWT, async (req, res, next) => {
  try {
    const user_id = req.user.id; // dal JWT
    requireFields(req.body, ['post_id']);
    const { data, error } = await supabase.from('likes')
      .insert({ post_id: req.body.post_id, user_id })
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    if (err.code === '23505') return res.status(200).json({ ok: true }); // like già esistente
    next(err);
  }
});

router.delete('/', authenticateJWT, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    requireFields(req.body, ['post_id']);
    const { error } = await supabase.from('likes')
      .delete()
      .eq('post_id', req.body.post_id)
      .eq('user_id', user_id);
    if (error) throw error;
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
