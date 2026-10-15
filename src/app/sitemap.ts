import type { MetadataRoute } from "next";
import { homeUrl } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return homeUrl
    ? [{ url: homeUrl, changeFrequency: "monthly", priority: 1 }]
    : [];
}
