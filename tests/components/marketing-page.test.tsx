import {cleanup, render, screen, within} from "@testing-library/react";
import {afterEach, describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {getPageByPath, getRouteByPath, PUBLIC_PATHS} from "@/content";
import {MarketingPageView} from "@/components/marketing/marketing-page";
import type {PublicPath} from "@/content/types";

afterEach(cleanup);

describe("marketing page templates", () => {
  it("renders the real home hero, three AI capability links, and ordered sections", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);
    expect(screen.getByRole("heading", {level: 1, name: "让大模型走进应用，让创意成为内容"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "LLM与多模态理解"})).toHaveAttribute("href", "/ai/llm");
    expect(screen.getByRole("link", {name: "AI图像生成与编辑"})).toHaveAttribute("href", "/ai/image");
    expect(screen.getByRole("link", {name: "AI视频生成与编辑"})).toHaveAttribute("href", "/ai/video");
    const sectionIds = [...document.querySelectorAll("section[id]")].map((section) => section.id);
    expect(sectionIds.slice(0, 8)).toEqual(["ai", "model-ecosystem", "idc", "madeinchina", "network", "energy", "delivery", "about"]);
    expect(screen.getByText(/实际可调用的型号及价格以平台目录为准/)).toBeInTheDocument();
  });

  it("keeps the about page useful without fake contact controls", () => {
    render(<MarketingPageView page={getPageByPath("/about")} />);
    expect(screen.getByText(/成都光波互联科技有限公司成立于2019年/)).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "协作完成交付"})).toBeInTheDocument();
    expect(document.querySelector("section#contact")).toHaveAttribute("aria-labelledby", "contact-heading");
    expect(document.querySelector("form")).toBeNull();
    expect(screen.queryByRole("link", {name: /联系项目顾问|立即咨询/})).not.toBeInTheDocument();
  });

  it("shows registry-based, accessible breadcrumbs on every inner page", () => {
    for (const path of PUBLIC_PATHS) {
      const view = render(<MarketingPageView page={getPageByPath(path)} />);
      if (path === "/") {
        expect(screen.queryByRole("navigation", {name: "面包屑导航"})).not.toBeInTheDocument();
      } else {
        const nav = screen.getByRole("navigation", {name: "面包屑导航"});
        const parents = PUBLIC_PATHS.filter((candidate) => candidate !== "/" && path.startsWith(`${candidate}/`));
        const expected = ["/", ...parents, path];
        expect(within(nav).getAllByRole("listitem")).toHaveLength(expected.length);
        const links = within(nav).getAllByRole("link").filter((link) => link.hasAttribute("href"));
        expect(links.map((link) => link.getAttribute("href"))).toEqual(expected.slice(0, -1));
        expect(links.map((link) => link.textContent)).toEqual(
          expected.slice(0, -1).map((candidate) => getRouteByPath(candidate as PublicPath).navLabel),
        );
        const current = within(nav).getByText(getRouteByPath(path).navLabel);
        expect(current).toHaveAttribute("aria-current", "page");
        expect(current).not.toHaveAttribute("href");
      }
      view.unmount();
    }
  });

  it("renders every route with one H1, complete sections, and approved internal links", () => {
    for (const path of PUBLIC_PATHS) {
      const page = getPageByPath(path);
      const view = render(<MarketingPageView page={page} />);
      expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
      expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(page.hero.title);
      for (const section of page.sections) {
        expect(document.getElementById(section.id)).toHaveAttribute("aria-labelledby", `${section.id}-heading`);
        expect(screen.getByRole("heading", {level: 2, name: section.title})).toBeInTheDocument();
        if (section.body) expect(screen.getByText(section.body)).toBeInTheDocument();
        const renderedSection = document.getElementById(section.id);
        for (const item of section.items ?? []) {
          expect(within(renderedSection!).getByRole("heading", {level: 3, name: item.title})).toBeInTheDocument();
          expect(within(renderedSection!).getAllByText(item.body, {exact: true}).length).toBeGreaterThan(0);
          if (item.meta) expect(within(renderedSection!).getAllByText(item.meta, {exact: true}).length).toBeGreaterThan(0);
        }
      }
      const approved = new Set<string>(PUBLIC_PATHS);
      for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
        expect(approved.has(anchor.getAttribute("href") ?? "")).toBe(true);
      }
      const related = getRouteByPath(path as PublicPath).relatedPaths;
      const relatedAnchors = [...document.querySelectorAll<HTMLAnchorElement>("section#related-services a[href]")];
      expect(relatedAnchors.map((anchor) => anchor.getAttribute("href"))).toEqual(related);
      view.unmount();
    }
  });

  it("preserves model availability caveats and business selection criteria", () => {
    render(<MarketingPageView page={getPageByPath("/ai/image")} />);
    expect(screen.getByText(/当前可调用范围以平台目录为准/)).toBeInTheDocument();
    cleanup();
    render(<MarketingPageView page={getPageByPath("/idc/colocation")} />);
    expect(screen.getByRole("heading", {name: "供电保障"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "制冷条件"})).toBeInTheDocument();
  });

  it("places the public copy and links in server-rendered HTML", () => {
    const html = renderToStaticMarkup(<MarketingPageView page={getPageByPath("/")} />);
    expect(html).toContain("让大模型走进应用，让创意成为内容");
    expect(html).toContain('href="/ai/llm"');
    expect(html).toContain("模型名称用于能力介绍");
  });

  it("shows a semantic station connection route with the source explanation", () => {
    render(<MarketingPageView page={getPageByPath("/network")} />);
    const topology = document.getElementById("topology");
    expect(topology).not.toBeNull();
    expect(within(topology!).getByText(/客户站点通过本地接入连接区域汇聚资源/)).toBeInTheDocument();
    expect(within(topology!).getByRole("figure", {name: "站点连接结构"})).toBeInTheDocument();
    const route = within(topology!).getByRole("list", {name: "站点连接路径"});
    expect(within(route).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "客户站点", "本地接入", "区域汇聚资源", "骨干传输", "目标区域与站点",
    ]);
    const html = renderToStaticMarkup(<MarketingPageView page={getPageByPath("/network")} />);
    expect(html).toContain("站点连接路径");
    expect(html).toContain("目标区域与站点");
  });

  it("introduces the company on home and links to the real about page", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);
    const aboutSection = document.getElementById("about");
    expect(aboutSection).not.toBeNull();
    expect(within(aboutSection!).getByText(getPageByPath("/about").hero.lead)).toBeInTheDocument();
    expect(within(aboutSection!).getByRole("link", {name: "了解光波互联"})).toHaveAttribute("href", "/about");
  });
});
