import { Router } from 'express';
import { supabase } from '../../lib/supabase';

const router = Router();

router.post('/', async (req, res) => {
  const { title, content, confession_type, username } = req.body;

  const finalUsername = username?.trim() || 'Anonymous';

  const { data, error } = await supabase
    .from('confessions')
    .insert([{ title, content, confession_type, username: finalUsername }])
    .select();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({
    message: 'Confession submitted successfully',
    data: data?.[0] || null,
  });
});

router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('confessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return
  }

  res.status(200).json(data);
  return
});

export default router;
