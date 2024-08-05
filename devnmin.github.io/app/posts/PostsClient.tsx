// app/posts/PostsClient.tsx (클라이언트 컴포넌트)
'use client';

import { createContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { prefix } from "../../config/config";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

const PortfolioContext = createContext({ prefix });

interface Post {
  slug: string;
}

interface PostsClientProps {
  posts: Post[];
}

export default function PostsClient({ posts }: PostsClientProps) {
  const [mdxContent, setMdxContent] = useState<MDXRemoteSerializeResult | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [postList, setPostList] = useState(posts);

  const fetchPostContent = async (slug: string) => {
    try {
      const response = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post content');
      }
      const data = await response.json();
      setMdxContent(data.content);
    } catch (error) {
      console.error('Error fetching post content:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await fetch('/api/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        const newPost = await response.json();
        alert('Post created successfully!');
        setTitle('');
        setContent('');
        setShowForm(false);
        setPostList([...postList, { slug: newPost.slug }]); // Update post list with the new slug
      } else {
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <PortfolioContext.Provider value={{ prefix }}>
      <div>
        <Navbar />
        <h1>TEST</h1>
        <button onClick={() => setShowForm(!showForm)}>Create New Post</button>
        {showForm && (
          <div>
            <h2>Create a New Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleCreatePost}>Submit</button>
          </div>
        )}
        <ul>
          {postList.map((post, i) => (
            <li key={i} onClick={() => fetchPostContent(post.slug)}>{post.slug}</li>
          ))}
        </ul>
        {mdxContent && <MDXRemote {...mdxContent} />}
      </div>
    </PortfolioContext.Provider>
  );
}
