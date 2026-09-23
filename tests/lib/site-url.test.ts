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
    const env = {NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: " https://www.guangbo.cn/path "};
    expect(getSiteOrigin(env)).toBe("https://www.guangbo.cn");
    expect(isIndexable(env)).toBe(true);
  });

  it("keeps preview builds out of the index", () => {
    expect(isIndexable({NODE_ENV: "development", NEXT_PUBLIC_SITE_URL: "https://www.guangbo.cn"})).toBe(false);
  });

  it.each([
    "http://www.guangbo.cn",
    "https://localhost:43187",
    "https://localhost.",
    "https://127.0.0.1:43187",
    "https://[::1]",
    "https://www.example.com",
    "https://www.example.com.",
    "https://guangbo.example",
  ])("does not index an insecure, local or reserved origin: %s", (url) => {
    expect(isIndexable({NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: url})).toBe(false);
  });

  it.each([
    "guangbo",
    "ftp://guangbo.example",
    "https://",
    "mailto:info@guangbo.example",
    "https:example.com",
    "https://user:pass@www.guangbo.cn",
  ])(
    "rejects an explicitly invalid site URL: %s",
    (url) => {
      expect(() => getSiteOrigin({NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: url})).toThrow("Invalid NEXT_PUBLIC_SITE_URL");
    },
  );
});
