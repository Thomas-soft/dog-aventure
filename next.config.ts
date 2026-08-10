import type { NextConfig } from "next";

/* Build « préview client » sur GitHub Pages : export statique servi sous
   /dog-aventure — variables posées par .github/workflows/deploy-pages.yml. */
const ghPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // CSS inliné dans le HTML : supprime la requête render-blocking (site
  // one-page Tailwind, visiteurs majoritairement nouveaux → bon compromis)
  experimental: { inlineCss: true },
  ...(ghPages
    ? {
        output: "export" as const,
        basePath: "/dog-aventure",
        images: {
          loader: "custom" as const,
          loaderFile: "./lib/image-loader.ts",
        },
      }
    : {
        /* Sortie autonome : `next build` produit .next/standalone avec un
           server.js et le strict nécessaire de node_modules. C'est ce que
           copie l'étage final du Dockerfile — l'image n'embarque donc ni les
           dépendances de build ni le code source. */
        output: "standalone" as const,
      }),
};

export default nextConfig;
