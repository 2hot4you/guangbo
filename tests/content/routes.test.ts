import {describe, expect, it} from "vitest";
import {PUBLIC_PATHS, getRouteByPath, navigationGroups, routeEntries} from "@/content";

describe("public route registry", () => {
  it("contains exactly the 14 approved public paths without duplicates", () => {
    expect(PUBLIC_PATHS).toEqual([
      "/", "/ai", "/ai/llm", "/ai/image", "/ai/video",
      "/idc", "/idc/vps", "/idc/bare-metal", "/idc/colocation", "/idc/gpu",
      "/madeinchina", "/network", "/energy", "/about",
    ]);
    expect(new Set(PUBLIC_PATHS).size).toBe(14);
    expect(routeEntries).toHaveLength(14);
  });

  it("keeps every related path inside the public registry", () => {
    const known = new Set(PUBLIC_PATHS);
    for (const route of routeEntries) {
      expect(route.relatedPaths.every((path) => known.has(path))).toBe(true);
    }
  });

  it("makes AI and IDC overview pages reachable beside their children", () => {
    expect(navigationGroups.find((group) => group.label === "大模型与AIGC")?.overviewPath).toBe("/ai");
    expect(navigationGroups.find((group) => group.label === "IDC与算力")?.overviewPath).toBe("/idc");
  });

  it("throws for an unregistered path", () => {
    expect(() => getRouteByPath("/console" as never)).toThrow("Unknown public path");
  });
});
