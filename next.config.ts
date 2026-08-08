import type { NextConfig } from "next";

/* Build « préview client » sur GitHub Pages : export statique servi sous
   /dog-aventure — variables posées par .github/workflows/deploy-pages.yml.
   En local et sur un hébergeur Next.js (Vercel…), seul inlineCss s'applique. */
const ghPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // CSS inliné dans le HTML : supprime la requête render-blocking (site
  // one-page Tailwind, visiteurs majoritairement nouveaux → bon compromis)
  experimental: { inlineCss: true },
  ...(ghPages && {
    output: "export" as const,
    basePath: "/dog-aventure",
    images: {
      loader: "custom" as const,
      loaderFile: "./lib/image-loader.ts",
    },
  }),
};

export default nextConfig;
