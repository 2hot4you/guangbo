import type {MetadataRoute} from "next";
import {getSiteOrigin, isIndexable} from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return {rules: {userAgent: "*", allow: "/"}};
  }

  return {
    rules: {userAgent: "*", allow: "/"},
    sitemap: new URL("/sitemap.xml", getSiteOrigin()).toString(),
  };
}
