import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Апекс-домен постоянно редиректим на www — канонический хост один.
  redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kitayskiy-goroskop.ru" }],
        destination: "https://www.kitayskiy-goroskop.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
