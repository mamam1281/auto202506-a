/** @type {import('next').NextConfig} */
const nextConfig = {
  // Storybook 파일들을 빌드에서 제외
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    // .stories.tsx 파일들을 빌드에서 제외
    config.module.rules.push({
      test: /\.stories\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });
    return config;
  },
};

export default nextConfig;
