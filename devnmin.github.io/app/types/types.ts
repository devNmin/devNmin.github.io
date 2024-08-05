// types.ts 또는 이와 유사한 파일에 정의
export interface PostMatter {
  title: string;
  description: string;
  tags: string[];
  draft?: boolean;
  date: string;
}

export interface Post {
  title: string;
  description: string;
  tags: string[];
  draft?: boolean;
  date: string;
  slug: string;
  content: string;
  readingMinutes: number;
  wordCount: number;
};