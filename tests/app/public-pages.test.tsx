import {renderToStaticMarkup} from "react-dom/server";
import type {Metadata} from "next";
import {describe, expect, it} from "vitest";
import {getPageByPath, getRouteByPath, navigationGroups, PUBLIC_PATHS, type PublicPath} from "@/content";
import {getSiteOrigin} from "@/lib/site-url";
import HomePage, {metadata as homeMetadata} from "@/app/(marketing)/page";
import AiPage, {metadata as aiMetadata} from "@/app/(marketing)/ai/page";
import AiLlmPage, {metadata as aiLlmMetadata} from "@/app/(marketing)/ai/llm/page";
import AiImagePage, {metadata as aiImageMetadata} from "@/app/(marketing)/ai/image/page";
import AiVideoPage, {metadata as aiVideoMetadata} from "@/app/(marketing)/ai/video/page";
import IdcPage, {metadata as idcMetadata} from "@/app/(marketing)/idc/page";
import IdcVpsPage, {metadata as idcVpsMetadata} from "@/app/(marketing)/idc/vps/page";
import IdcBareMetalPage, {metadata as idcBareMetalMetadata} from "@/app/(marketing)/idc/bare-metal/page";
import IdcColocationPage, {metadata as idcColocationMetadata} from "@/app/(marketing)/idc/colocation/page";
import IdcGpuPage, {metadata as idcGpuMetadata} from "@/app/(marketing)/idc/gpu/page";
import MadeInChinaPage, {metadata as madeInChinaMetadata} from "@/app/(marketing)/madeinchina/page";
import NetworkPage, {metadata as networkMetadata} from "@/app/(marketing)/network/page";
import EnergyPage, {metadata as energyMetadata} from "@/app/(marketing)/energy/page";
import AboutPage, {metadata as aboutMetadata} from "@/app/(marketing)/about/page";

const modules = [
  {path: "/", component: HomePage, metadata: homeMetadata, name: "HomePage"},
  {path: "/ai", component: AiPage, metadata: aiMetadata, name: "AiPage"},
  {path: "/ai/llm", component: AiLlmPage, metadata: aiLlmMetadata, name: "AiLlmPage"},
  {path: "/ai/image", component: AiImagePage, metadata: aiImageMetadata, name: "AiImagePage"},
  {path: "/ai/video", component: AiVideoPage, metadata: aiVideoMetadata, name: "AiVideoPage"},
  {path: "/idc", component: IdcPage, metadata: idcMetadata, name: "IdcPage"},
  {path: "/idc/vps", component: IdcVpsPage, metadata: idcVpsMetadata, name: "IdcVpsPage"},
  {path: "/idc/bare-metal", component: IdcBareMetalPage, metadata: idcBareMetalMetadata, name: "IdcBareMetalPage"},
  {path: "/idc/colocation", component: IdcColocationPage, metadata: idcColocationMetadata, name: "IdcColocationPage"},
  {path: "/idc/gpu", component: IdcGpuPage, metadata: idcGpuMetadata, name: "IdcGpuPage"},
  {path: "/madeinchina", component: MadeInChinaPage, metadata: madeInChinaMetadata, name: "MadeInChinaPage"},
  {path: "/network", component: NetworkPage, metadata: networkMetadata, name: "NetworkPage"},
  {path: "/energy", component: EnergyPage, metadata: energyMetadata, name: "EnergyPage"},
  {path: "/about", component: AboutPage, metadata: aboutMetadata, name: "AboutPage"},
] as const satisfies readonly {
  path: PublicPath;
  component: () => React.JSX.Element;
  metadata: Metadata;
  name: string;
}[];

describe("explicit public route modules", () => {
  const industryTargets = [
    {path: "/madeinchina", component: MadeInChinaPage},
    {path: "/network", component: NetworkPage},
    {path: "/energy", component: EnergyPage},
  ] as const;

  it.each(industryTargets)("renders every configured navigation target exactly once on $path", ({path, component}) => {
    const targetIds = navigationGroups.flatMap((item) => item.kind === "group" ? item.columns.flatMap((column) => column.links) : [])
      .filter((link) => link.path === path && link.sectionId !== undefined)
      .map((link) => link.sectionId);
    const html = renderToStaticMarkup(component());
    const sectionIds = [...html.matchAll(/<section\b[^>]*data-content-module[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(targetIds).toHaveLength(12);
    expect(new Set(targetIds).size).toBe(targetIds.length);
    expect(sectionIds.length).toBeGreaterThanOrEqual(12);
    expect(new Set(sectionIds).size).toBe(sectionIds.length);
    for (const id of targetIds) expect(sectionIds.filter((actual) => actual === id)).toHaveLength(1);
  });

  it("covers exactly the approved route registry", () => {
    expect(modules.map(({path}) => path)).toEqual(PUBLIC_PATHS);
  });

  it.each(modules)("renders $path with route-specific metadata", ({path, component, metadata, name}) => {
    const page = getPageByPath(path);
    const route = getRouteByPath(path);
    const html = renderToStaticMarkup(component());

    expect(component.name).toBe(name);
    expect(html).toContain(`<h1`);
    expect(html).toContain(page.hero.title);
    expect(html).toContain(page.hero.lead);
    expect((html.match(/<h1\b/g) ?? [])).toHaveLength(1);
    expect(metadata.title).toBe(route.title);
    expect(metadata.description).toBe(route.description);
    expect(metadata.alternates?.canonical).toBe(new URL(path, getSiteOrigin()).toString());
  });
});
