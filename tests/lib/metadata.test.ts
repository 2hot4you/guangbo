import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {PUBLIC_PATHS, getRouteByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

const origin = "https://www.guangbo.example";

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
});

afterEach(() => vi.unstubAllEnvs());

describe("public SEO metadata", () => {
  it("gives every approved page a unique title, description, canonical and social text", () => {
    const titles = new Set<string>();
    for (const path of PUBLIC_PATHS) {
      const route = getRouteByPath(path);
      const metadata = createPageMetadata(path);
      titles.add(String(metadata.title));
      expect(metadata.title).toBe(route.title);
      expect(metadata.description).toBe(route.description);
      expect(metadata.description).not.toBe("");
      expect(metadata.alternates?.canonical).toBe(`${origin}${path}`);
      expect(metadata.openGraph?.title).toBe(route.title);
      expect(metadata.openGraph?.description).toBe(route.description);
      expect(metadata.twitter?.title).toBe(route.title);
      expect(metadata.twitter?.description).toBe(route.description);
      expect(metadata.openGraph).not.toHaveProperty("images");
      expect(metadata.twitter).not.toHaveProperty("images");
    }
    expect(titles.size).toBe(14);
  });

  it("publishes exactly the approved sitemap paths", () => {
    const entries = sitemap();
    expect(entries.map((entry) => new URL(entry.url).pathname)).toEqual(PUBLIC_PATHS);
    expect(entries.every((entry) => entry.url.startsWith(origin))).toBe(true);
    expect(entries.every((entry) => entry.lastModified instanceof Date)).toBe(true);
    expect(entries.every((entry) => entry.changeFrequency === "monthly")).toBe(true);
  });

  it("allows crawling and advertises the sitemap for a production origin", () => {
    expect(robots()).toEqual({
      rules: {userAgent: "*", allow: "/"},
      sitemap: `${origin}/sitemap.xml`,
    });
  });

  it("disallows crawling without a configured origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", " ");
    expect(robots()).toEqual({rules: {userAgent: "*", disallow: "/"}});
  });
});
