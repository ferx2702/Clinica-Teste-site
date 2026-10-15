import { sitePath } from "@/lib/site";
import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(origin ? { sitemap: `${origin}${sitePath("/sitemap.xml")}` } : {}),
  };
}
