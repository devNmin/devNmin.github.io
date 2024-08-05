import { GetStaticPaths, GetStaticProps } from 'next';

import { getAllPosts } from '../../libs/posts';

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => post.slug),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  const { slugs } = params as { slugs: string[] };

  const slug = `/posts/${[...slugs].join('/')}`;
  const post = getAllPosts().find((post) => post.slug === slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug,
    },
  };
};

export default function PostPage({ slug }: { slug: string }) {
  return <div>{slug}</div>;
}