// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getPost } from '@/libs/posts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    res.status(400).json({ error: 'Invalid slug' });
    return;
  }

  const post = await getPost(slug);

  res.status(200).json(post);
}
