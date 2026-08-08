import type { MetadataRoute } from "next";
import { site } from "@/content/site.config";

// Requis par l'export statique (préview GitHub Pages)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
