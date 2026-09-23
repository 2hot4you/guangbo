import type {Metadata} from "next";
import {getRouteByPath, type PublicPath} from "@/content";
import {getSiteOrigin, isIndexable} from "./site-url";

export function createPageMetadata(path: PublicPath): Metadata {
  const route = getRouteByPath(path);
  const canonical = new URL(path, getSiteOrigin()).toString();

  return {
    title: route.title,
    description: route.description,
    alternates: {canonical},
    robots: isIndexable() ? {index: true, follow: true} : {index: false, follow: false},
    openGraph: {
      title: route.title,
      description: route.description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: route.title,
      description: route.description,
    },
  };
}
