import {cleanup, render, screen, within} from "@testing-library/react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it} from "vitest";
import {about, energy, madeInChina, network} from "@/content/pages/business";
import {AboutLandingPage} from "@/components/marketing/about-landing-page";
import {EnergyLandingPage} from "@/components/marketing/energy-landing-page";
import {NetworkLandingPage} from "@/components/marketing/network-landing-page";
import {XinchangLandingPage} from "@/components/marketing/xinchang-landing-page";
import type {ContentSection} from "@/content/types";

afterEach(cleanup);

const pages = [
  {name: "信创", page: madeInChina, Component: XinchangLandingPage, ids: ["diagnostic", "layers", "hardware", "applications", "data", "compatibility", "industries", "delivery"]},
  {name: "专线", page: network, Component: NetworkLandingPage, ids: ["products", "inputs", "topology", "solutions", "continuity", "interfaces", "rollout", "boundaries"]},
  {name: "能源", page: energy, Component: EnergyLandingPage, ids: ["inputs", "green-power", "purchase", "management", "projects", "carbon", "scenarios", "delivery"]},
  {name: "关于我们", page: about, Component: AboutLandingPage, ids: ["identity", "business-map", "approach", "practice", "ecosystem", "principles", "delivery", "contact"]},
] as const;

describe("distinct business landing pages", () => {
  it.each(pages)("renders the $name content as one h1 and nine addressable modules", ({page, Component, ids}) => {
    render(<Component page={page} />);

    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(page.hero.title);
    const root = document.querySelector(`[data-landing-page="${page.key}"]`);
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe("DIV");
    const modules = [...root!.querySelectorAll("section[data-content-module]")];
    expect(modules).toHaveLength(9);
    expect(modules.map((module) => module.id)).toEqual([`${page.key}-hero`, ...ids]);
    expect(new Set(modules.map((module) => module.id)).size).toBe(modules.length);
    for (const contentModule of modules) {
      expect(contentModule).toHaveAttribute("aria-labelledby", `${contentModule.id}-heading`);
    }
    for (const section of page.sections as readonly ContentSection[]) {
      expect(within(root as HTMLElement).getByRole("heading", {level: 2, name: section.title})).toBeInTheDocument();
    }
  });

  it.each(pages)("keeps every $name section body and item in DOM and server HTML", ({page, Component}) => {
    const html = renderToStaticMarkup(<Component page={page} />);
    const serverDocument = new DOMParser().parseFromString(html, "text/html");
    const {container} = render(<Component page={page} />);

    for (const section of page.sections as readonly ContentSection[]) {
      const clientSection = container.querySelector(`section[id="${section.id}"]`);
      const serverSection = serverDocument.querySelector(`section[id="${section.id}"]`);
      expect(clientSection, `${page.key}/${section.id} in DOM`).not.toBeNull();
      expect(serverSection, `${page.key}/${section.id} in server HTML`).not.toBeNull();
      for (const value of [section.body, ...((section.items ?? []).flatMap((item) => [item.title, item.body, item.meta]))]) {
        if (!value) continue;
        expect(clientSection?.textContent, `${page.key}/${section.id}: ${value} in DOM`).toContain(value);
        expect(serverSection?.textContent, `${page.key}/${section.id}: ${value} in server HTML`).toContain(value);
      }
    }
  });

  it.each([
    {name: "信创", page: madeInChina, Component: XinchangLandingPage, figure: "企业系统四层架构蓝图", caption: "架构概览"},
    {name: "专线", page: network, Component: NetworkLandingPage, figure: "首屏站点连接路径", caption: "站点路径示意"},
    {name: "能源", page: energy, Component: EnergyLandingPage, figure: "首屏企业用能路径", caption: "用能路径示意"},
    {name: "关于我们", page: about, Component: AboutLandingPage, figure: "公司形象视觉占位", caption: "公司图片尚待确认"},
  ])("shows the $name key visual and caption in the hero", ({page, Component, figure, caption}) => {
    const html = renderToStaticMarkup(<Component page={page} />);
    render(<Component page={page} />);
    const hero = document.getElementById(`${page.key}-hero`)!;
    const visual = within(hero).getByRole("figure", {name: figure});
    expect(within(visual).getByText(new RegExp(caption))).toBeInTheDocument();
    const serverHero = new DOMParser().parseFromString(html, "text/html").getElementById(`${page.key}-hero`);
    expect(serverHero?.querySelector("figure")?.textContent).toContain(caption);
  });

  it.each([
    {name: "信创", page: madeInChina, Component: XinchangLandingPage, section: "layers", figure: "系统分层详图", caption: "架构示意"},
    {name: "专线", page: network, Component: NetworkLandingPage, section: "topology", figure: "站点连接结构", caption: "示意路径"},
    {name: "能源", page: energy, Component: EnergyLandingPage, section: "inputs", figure: "企业用能输入资料", caption: "输入资料"},
  ])("keeps the $name detail figure caption readable", ({page, Component, section, figure, caption}) => {
    const html = renderToStaticMarkup(<Component page={page} />);
    render(<Component page={page} />);
    const clientFigure = within(document.getElementById(section)!).getByRole("figure", {name: figure});
    expect(within(clientFigure).getByText(new RegExp(caption))).toBeInTheDocument();
    const serverFigure = new DOMParser().parseFromString(html, "text/html").getElementById(section)?.querySelector("figure");
    expect(serverFigure?.textContent).toContain(caption);
  });

  it("shows a four-layer blueprint and a compatibility check for the digitalization page", () => {
    render(<XinchangLandingPage page={madeInChina} />);

    const blueprint = within(document.getElementById("madeInChina-hero")!).getByRole("figure", {name: "企业系统四层架构蓝图"});
    expect(within(blueprint).getAllByRole("listitem")).toHaveLength(4);
    for (const layer of ["接入层", "业务层", "数据与集成层", "基础设施层"]) {
      expect(within(blueprint).getByText(layer)).toBeInTheDocument();
    }
    for (const layer of madeInChina.sections[1].items ?? []) {
      expect(within(blueprint).queryByText(layer.body)).not.toBeInTheDocument();
      expect(within(document.getElementById("layers")!).getByText(layer.body)).toBeInTheDocument();
    }
    expect(within(document.getElementById("compatibility")!).getByText(/处理器、操作系统、数据库与业务软件/)).toBeInTheDocument();
  });

  it("shows a left-to-right station route and explicit connection boundaries", () => {
    render(<NetworkLandingPage page={network} />);

    const topology = screen.getByRole("figure", {name: "站点连接结构"});
    expect(topology).not.toHaveClass("network-topology");
    expect(topology).toHaveClass("bg-[#080808]", "text-white");
    const route = within(topology).getByRole("list", {name: "站点连接路径"});
    expect(within(route).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "客户站点", "本地接入", "区域汇聚资源", "骨干传输", "目标区域与站点",
    ]);
    expect(within(document.getElementById("interfaces")!).getByRole("heading", {level: 3, name: "客户侧"})).toBeInTheDocument();
    expect(within(document.getElementById("boundaries")!).getByText(/按具体线路确认/)).toBeInTheDocument();
    const overview = within(document.getElementById("network-hero")!).getByRole("list", {name: "首屏连接概览"});
    expect(within(overview).getAllByRole("listitem")).toHaveLength(3);
    expect(within(overview).queryByText("区域汇聚资源")).not.toBeInTheDocument();
  });

  it("follows energy inputs through service paths and project options", () => {
    render(<EnergyLandingPage page={energy} />);

    const flow = screen.getByRole("figure", {name: "企业用能输入资料"});
    expect(within(flow).getAllByRole("listitem")).toHaveLength(4);
    for (const label of ["所在地区", "用电规模", "历史负荷", "绿色用能目标"]) {
      expect(within(flow).getByText(label)).toBeInTheDocument();
    }
    expect(within(document.getElementById("projects")!).getByRole("heading", {level: 3, name: "分布式光伏"})).toBeInTheDocument();
    expect(within(document.getElementById("carbon")!).getByText(/服务边界/)).toBeInTheDocument();
    expect(within(document.getElementById("energy-hero")!).getByRole("list", {name: "首屏用能路径"}).querySelectorAll("li")).toHaveLength(4);
    expect(within(document.getElementById("energy-hero")!).queryByText("地区 · 规模 · 负荷 · 目标")).not.toBeInTheDocument();
    const placeholder = within(document.getElementById("energy-hero")!).getByRole("figure", {name: "清洁能源项目视觉占位"});
    expect(within(placeholder).getByText("项目图片尚待确认")).toBeInTheDocument();
  });

  it("tells the company story without inventing a contact method", () => {
    const html = renderToStaticMarkup(<AboutLandingPage page={about} />);
    render(<AboutLandingPage page={about} />);

    expect(screen.getByText(/成都光波互联科技有限公司成立于2019年/)).toBeInTheDocument();
    expect(screen.getByRole("figure", {name: "公司业务版图"})).toBeInTheDocument();
    expect(within(document.getElementById("ecosystem")!).getByRole("heading", {level: 3, name: "合作生态"})).toBeInTheDocument();
    expect(within(document.getElementById("contact")!).getByText(/联系信息尚未确认/)).toBeInTheDocument();
    expect(document.querySelector("form")).toBeNull();
    expect(html).not.toContain("mailto:");
    expect(html).not.toContain("tel:");
  });
});
