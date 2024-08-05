import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { sync } from 'glob';
const BASE_PATH = 'app/posts';
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

// POSIX 스타일의 경로를 사용하여 glob 패턴 생성
const POSIX_POSTS_PATH = path.posix.join(process.cwd().replace(/\\/g, '/'), BASE_PATH.replace(/\\/g, '/'));

export const getAllPosts = () => {

  const postPaths: string[] = sync(`${POSIX_POSTS_PATH}/**/*.mdx`);


  return postPaths.map((filePath) => {
    const relativePath = path.relative(POSTS_PATH, filePath);

    return {
      slug: relativePath.replace(/\.mdx$/, ''), // '.mdx' 확장자 제거
    };
  });
};

export async function getPost(slug: string): Promise<{ content: MDXRemoteSerializeResult; frontMatter: any }> {
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, 'utf8');

  const { content, data } = matter(source);
  const mdxSource = await serialize(content, { scope: data });

  return {
    content: mdxSource,
    frontMatter: data,
  };
}
