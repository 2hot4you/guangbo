import {describe, expect, it} from "vitest";
import {getSiteOrigin, isIndexable} from "@/lib/site-url";

describe("site origin", () => {
  it("uses localhost and noindex when the site URL is absent or blank", () => {
    expect(getSiteOrigin({NODE_ENV: "production"})).toBe("http://localhost:43187");
    expect(getSiteOrigin({NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "  "})).toBe("http://localhost:43187");
    expect(isIndexable({NODE_ENV: "production"})).toBe(false);
    expect(isIndexable({NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "  "})).toBe(false);
  });

  it("normalizes a valid production origin and enables indexing", () => {
    const env = {NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: " https://www.guangbo.example/path "};
    expect(getSiteOrigin(env)).toBe("https://www.guangbo.example");
    expect(isIndexable(env)).toBe(true);
  });

  it("keeps preview builds out of the index", () => {
    expect(isIndexable({NODE_ENV: "development", NEXT_PUBLIC_SITE_URL: "https://www.guangbo.example"})).toBe(false);
  });

  it.each(["guangbo", "ftp://guangbo.example", "https://", "mailto:info@guangbo.example"])(
    "rejects an explicitly invalid site URL: %s",
    (url) => {
      expect(() => getSiteOrigin({NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: url})).toThrow("Invalid NEXT_PUBLIC_SITE_URL");
    },
  );
});
