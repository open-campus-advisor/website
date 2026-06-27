import type { MetadataRoute } from "next";
import { ALL_SLUGS } from "../lib/schools";
import { COMPARE_PAIRS, pairId } from "../lib/compare-pairs";

const BASE = "https://opencampusadvisor.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/schools`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/compare`,     lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/integrate`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/mcp`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacy`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const school_pages: MetadataRoute.Sitemap = ALL_SLUGS.map(slug => ({
    url: `${BASE}/schools/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const compare_pages: MetadataRoute.Sitemap = COMPARE_PAIRS.map(p => ({
    url: `${BASE}/compare/${pairId(p.slug1, p.slug2)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [...static_pages, ...school_pages, ...compare_pages];
}
