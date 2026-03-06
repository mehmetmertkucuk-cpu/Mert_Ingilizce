/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js output so that API routes work on platforms like Netlify.
  // (Static "export" is disabled because it does not support dynamic app routes.)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;