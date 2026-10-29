import type { NextConfig } from "next";

// Without S3, Medusa serves uploads from its own /static folder.
function backendImages() {
  const url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  if (!url) return []
  const { protocol, hostname, port } = new URL(url)
  return [{ protocol: protocol.replace(":", "") as "http" | "https", hostname, port, pathname: "/static/**" }]
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // Product images uploaded in the Medusa admin are stored in S3.
    remotePatterns: [{ protocol: "https", hostname: "**.amazonaws.com" }, ...backendImages()],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
