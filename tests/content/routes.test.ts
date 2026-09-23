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

  it("describes the AI overview within the released consultation scope", () => {
    expect(getRouteByPath("/ai").description).toContain("API接入咨询");
    expect(getRouteByPath("/ai").description).not.toContain("使用管理入口");
  });

  it("makes AI and IDC overview pages reachable beside their children", () => {
    expect(navigationGroups.find((group) => group.label === "大模型与AIGC")?.overviewPath).toBe("/ai");
    expect(navigationGroups.find((group) => group.label === "IDC与算力")?.overviewPath).toBe("/idc");
  });

  it("links all seven AI and IDC child pages from their groups", () => {
    const groups = navigationGroups.filter((item) => item.kind === "group");
    expect(groups.map((group) => ({
      overviewPath: group.overviewPath,
      childPaths: group.children.map((child) => child.path),
    }))).toEqual([
      {overviewPath: "/ai", childPaths: ["/ai/llm", "/ai/image", "/ai/video"]},
      {overviewPath: "/idc", childPaths: ["/idc/vps", "/idc/bare-metal", "/idc/colocation", "/idc/gpu"]},
    ]);
  });

  it("links the four direct pages without duplicate or unregistered destinations", () => {
    const directPaths = navigationGroups
      .filter((item) => item.kind === "link")
      .map((item) => item.path);
    expect(directPaths).toEqual(["/madeinchina", "/network", "/energy", "/about"]);

    const allPaths = navigationGroups.flatMap((item) =>
      item.kind === "group"
        ? [item.overviewPath, ...item.children.map((child) => child.path)]
        : [item.path],
    );
    expect(allPaths).toHaveLength(13);
    expect(new Set(allPaths).size).toBe(allPaths.length);
    expect(allPaths.every((path) => PUBLIC_PATHS.includes(path))).toBe(true);
  });

  it("throws for an unregistered path", () => {
    expect(() => getRouteByPath("/console" as never)).toThrow("Unknown public path");
  });
});
