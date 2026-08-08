import type { NextConfig } from "next";

/* Build « préview client » sur GitHub Pages : export statique servi sous
   /dog-aventure — variables posées par .github/workflows/deploy-pages.yml.
   En local et sur un hébergeur Next.js (Vercel…), la config reste vide. */
const ghPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = ghPages
  ? {
      output: "export",
      basePath: "/dog-aventure",
      images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
    }
  : {};

export default nextConfig;
