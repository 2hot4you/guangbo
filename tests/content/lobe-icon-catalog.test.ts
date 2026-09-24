import {describe, expect, it} from "vitest";
import {
  LOBE_ICON_CATALOG_VERSION,
  lobeModelCatalog,
  lobeProviderCatalog,
} from "@/content/lobe-icon-catalog";

describe("LobeHub catalog snapshot", () => {
  it("pins the complete provider and model categories", () => {
    expect(LOBE_ICON_CATALOG_VERSION).toBe("5.21.0");
    expect(lobeProviderCatalog).toHaveLength(136);
    expect(lobeModelCatalog).toHaveLength(72);
    expect(lobeProviderCatalog.every((item) => item.category === "provider")).toBe(true);
    expect(lobeModelCatalog.every((item) => item.category === "model")).toBe(true);
  });

  it("keeps ids unique inside each category and excludes applications", () => {
    expect(new Set(lobeProviderCatalog.map((item) => item.id)).size).toBe(136);
    expect(new Set(lobeModelCatalog.map((item) => item.id)).size).toBe(72);
    expect([...lobeProviderCatalog, ...lobeModelCatalog].some((item) => String(item.name) === "Cursor")).toBe(false);
  });
});
