// pages/api/createPost.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

const BASE_PATH = 'app/posts';
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dirPath = path.join(POSTS_PATH, year.toString(), month);
  
  // Use slugify to create a URL-safe slug from the title
  const sanitizedTitle = slugify(title, {
    lower: true,
    strict: true,
    locale: 'ko'
  });

  const filePath = path.join(dirPath, `${sanitizedTitle}.mdx`);

  const fileContent = `---
title: "${title}"
date: "${currentDate.toISOString().split('T')[0]}"
---

${content}
`;

  try {
    // 디렉토리가 없는 경우 생성
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, fileContent, 'utf8');
    res.status(200).json({ message: 'Post created successfully', slug: `${year}/${month}/${sanitizedTitle}` });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
}
