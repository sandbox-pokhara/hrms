/** @type {import('next').NextConfig} */
const API_HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://backend:8000";
const nextConfig = {
  trailingSlash: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/admin/:path*/",
        destination: `${API_HOST}/admin/:path*/`,
      },
      {
        source: "/api/:path*/",
        destination: `${API_HOST}/api/:path*/`,
      },
      {
        source: "/static/:path*/",
        destination: `${API_HOST}/static/:path*/`,
      },
      {
        source: "/admin/:path*",
        destination: `${API_HOST}/admin/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${API_HOST}/api/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${API_HOST}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;
