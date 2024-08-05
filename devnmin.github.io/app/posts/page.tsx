// app/posts/page.tsx (서버 컴포넌트)
import { getAllPosts } from '@/libs/posts';
import PostsClient from './PostsClient';

export default function PostsPage() {
  const posts = getAllPosts();

  return <PostsClient posts={posts} />;
}
