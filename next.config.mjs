/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This project is self-contained; pin tracing root to silence the
  // multi-lockfile workspace-root inference warning.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
