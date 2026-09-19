import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/constants";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${COMPANY.siteUrl}/sitemap.xml`, host: COMPANY.siteUrl }; }
