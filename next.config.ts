import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Генератор PDF читает эти шрифты с диска во время запроса. Их никто не
  // импортирует, поэтому трассировка файлов не увидит зависимость и роуты
  // уедут в деплой без шрифтов — вся кириллица превратится в мусор.
  outputFileTracingIncludes: {
    '/api/webhook': ['./public/fonts/**'],
    '/api/generate-pdf': ['./public/fonts/**'],
  },

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
