import remarkGfm from 'remark-gfm'

 // Merge MDX config with Next.js config

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    basePath: "",
    assetPrefix:
      process.env.NODE_ENV === "production"
        ? "https://devnmin.github.io"
        : "",
    reactStrictMode: true,
    images: {
      unoptimized: true, // 이미지 정상적으로 불러올 수 있도록함
    },
    compiler: {
      styledComponents: true, // styled-components 사용 시 컴파일러에 추가
    },
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false };

      return config;
    },
}

