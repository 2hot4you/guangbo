import {cleanup, render, screen, within} from "@testing-library/react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it} from "vitest";
import {about, energy, madeInChina, network} from "@/content/pages/business";
import {AboutLandingPage} from "@/components/marketing/about-landing-page";
import {EnergyLandingPage} from "@/components/marketing/energy-landing-page";
import {NetworkLandingPage} from "@/components/marketing/network-landing-page";
import {XinchangLandingPage} from "@/components/marketing/xinchang-landing-page";

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
    const modules = [...root!.querySelectorAll("section[data-content-module]")];
    expect(modules).toHaveLength(9);
    expect(modules.map((module) => module.id)).toEqual([`${page.key}-hero`, ...ids]);
    expect(new Set(modules.map((module) => module.id)).size).toBe(modules.length);
    for (const contentModule of modules) {
      expect(contentModule).toHaveAttribute("aria-labelledby", `${contentModule.id}-heading`);
    }
    for (const section of page.sections) {
      expect(within(root as HTMLElement).getByRole("heading", {level: 2, name: section.title})).toBeInTheDocument();
    }
  });

  it("shows a four-layer blueprint and a compatibility check for the digitalization page", () => {
    render(<XinchangLandingPage page={madeInChina} />);

    const blueprint = screen.getByRole("figure", {name: "企业系统四层架构蓝图"});
    expect(within(blueprint).getAllByRole("listitem")).toHaveLength(4);
    for (const layer of ["接入层", "业务层", "数据与集成层", "基础设施层"]) {
      expect(within(blueprint).getByText(layer)).toBeInTheDocument();
    }
    expect(within(document.getElementById("compatibility")!).getByText(/处理器、操作系统、数据库与业务软件/)).toBeInTheDocument();
  });

  it("shows a left-to-right station route and explicit connection boundaries", () => {
    render(<NetworkLandingPage page={network} />);

    const topology = screen.getByRole("figure", {name: "站点连接结构"});
    const route = within(topology).getByRole("list", {name: "站点连接路径"});
    expect(within(route).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "客户站点", "本地接入", "区域汇聚资源", "骨干传输", "目标区域与站点",
    ]);
    expect(within(document.getElementById("interfaces")!).getByRole("heading", {level: 3, name: "客户侧"})).toBeInTheDocument();
    expect(within(document.getElementById("boundaries")!).getByText(/按具体线路确认/)).toBeInTheDocument();
  });

  it("follows energy inputs through service paths and project options", () => {
    render(<EnergyLandingPage page={energy} />);

    const flow = screen.getByRole("figure", {name: "企业用能服务路径"});
    expect(within(flow).getAllByRole("listitem")).toHaveLength(4);
    for (const label of ["用能起点", "需求分析", "方案对接", "项目评估"]) {
      expect(within(flow).getByText(label)).toBeInTheDocument();
    }
    expect(within(document.getElementById("projects")!).getByRole("heading", {level: 3, name: "分布式光伏"})).toBeInTheDocument();
    expect(within(document.getElementById("carbon")!).getByText(/服务边界/)).toBeInTheDocument();
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
