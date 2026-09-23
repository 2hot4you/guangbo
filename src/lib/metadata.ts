import type {Metadata} from "next";
import {getRouteByPath, type PublicPath} from "@/content";
import {getSiteOrigin} from "./site-url";

export function createPageMetadata(path: PublicPath): Metadata {
  const route = getRouteByPath(path);
  const canonical = new URL(path, getSiteOrigin()).toString();

  return {
    title: route.title,
    description: route.description,
    alternates: {canonical},
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
