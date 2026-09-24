import {describe, expect, it} from "vitest";
import * as content from "@/content";

const {PUBLIC_PATHS, getNavigationHref, getRouteByPath, navigationGroups, routeEntries} = content;

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

  it("makes all five business destinations expandable while Home and About remain direct links", () => {
    expect(navigationGroups.map((item) => [item.kind, item.kind === "group" ? item.overviewPath : item.path])).toEqual([
      ["link", "/"],
      ["group", "/ai"],
      ["group", "/idc"],
      ["group", "/madeinchina"],
      ["group", "/network"],
      ["group", "/energy"],
      ["link", "/about"],
    ]);
  });

  it("exposes all seven AI and IDC detail pages through column links", () => {
    const groups = navigationGroups.filter((item) => item.kind === "group");
    expect(groups.find((group) => group.overviewPath === "/ai")?.columns.flatMap((column) => column.links.map((link) => link.path))).toEqual([
      "/ai/llm", "/ai/image", "/ai/video",
    ]);
    expect(groups.find((group) => group.overviewPath === "/idc")?.columns.flatMap((column) => column.links.map((link) => link.path))).toEqual([
      "/idc/vps", "/idc/bare-metal", "/idc/colocation", "/idc/gpu",
    ]);
  });

  it("gives the three industry hubs product and solution columns", () => {
    for (const path of ["/madeinchina", "/network", "/energy"]) {
      const item = navigationGroups.find((entry) => entry.kind === "group" && entry.overviewPath === path);
      expect(item?.kind).toBe("group");
      if (item?.kind !== "group") continue;
      expect(item.columns.map((column) => column.heading)).toEqual(expect.arrayContaining(["产品与服务", "解决方案"]));
      expect(item.columns.every((column) => column.links.length > 0)).toBe(true);
    }
  });

  it("keeps every published route reachable through an overview or a column link", () => {
    expect(navigationGroups[0]).toEqual({kind: "link", label: "首页", path: "/"});
    const directPaths = navigationGroups
      .filter((item) => item.kind === "link")
      .map((item) => item.path);
    expect(directPaths).toEqual(["/", "/about"]);

    const allPaths = navigationGroups.flatMap((item) =>
      item.kind === "group"
        ? [item.overviewPath, ...item.columns.flatMap((column) => column.links.map((link) => link.path))]
        : [item.path],
    );
    expect(new Set(allPaths)).toEqual(new Set(PUBLIC_PATHS));
    expect(allPaths.every((path) => PUBLIC_PATHS.includes(path))).toBe(true);
  });

  it("derives complete hrefs from registered paths and non-empty section IDs", () => {
    expect(getNavigationHref({kind: "link", label: "VPS", path: "/idc/vps"})).toBe("/idc/vps");
    expect(getNavigationHref({kind: "link", label: "光纤", path: "/network", sectionId: "fiber-cloud"})).toBe("/network#fiber-cloud");
    expect(() => getNavigationHref({kind: "link", label: "空锚点", path: "/network", sectionId: " "})).toThrow("sectionId");

    const columnLinks = navigationGroups.flatMap((item) =>
      item.kind === "group" ? item.columns.flatMap((column) => column.links) : [],
    );
    for (const link of columnLinks) {
      expect(PUBLIC_PATHS).toContain(link.path);
      if (link.sectionId !== undefined) expect(link.sectionId.trim()).not.toBe("");
      expect(getNavigationHref(link)).toBe(link.sectionId ? `${link.path}#${link.sectionId}` : link.path);
      expect(getNavigationHref(link)).not.toContain("/console");
      expect(getNavigationHref(link)).not.toMatch(/#$/);
    }
  });

  it("throws for an unregistered path", () => {
    expect(() => getRouteByPath("/console" as never)).toThrow("Unknown public path");
  });
});
