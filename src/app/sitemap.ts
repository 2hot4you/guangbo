import type {MetadataRoute} from "next";
import {routeEntries} from "@/content";
import {getSiteOrigin} from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  return routeEntries.map((entry) => ({
    url: new URL(entry.path, origin).toString(),
    lastModified: new Date("2026-09-23"),
    changeFrequency: "monthly",
    priority: entry.path === "/" ? 1 : 0.7,
  }));
}
