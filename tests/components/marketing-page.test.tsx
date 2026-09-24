import {cleanup, render, screen, within} from "@testing-library/react";
import {afterEach, describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {getPageByPath, getRouteByPath, PUBLIC_PATHS} from "@/content";
import {MarketingPageView} from "@/components/marketing/marketing-page";
import type {PublicPath} from "@/content/types";

afterEach(cleanup);

describe("marketing page templates", () => {
  it.each([
    ["/ai", "ai", ["/ai/llm", "/ai/image", "/ai/video"]],
    ["/idc", "idc", ["/idc/vps", "/idc/bare-metal", "/idc/colocation", "/idc/gpu"]],
    ["/madeinchina", "madeInChina", ["/idc", "/network"]],
    ["/network", "network", ["/idc", "/madeinchina"]],
    ["/energy", "energy", ["/idc", "/madeinchina"]],
    ["/about", "about", ["/ai", "/idc", "/madeinchina", "/network", "/energy"]],
  ] as const)("renders %s as its dedicated landing page", (path, landing, relatedPaths) => {
    const page = getPageByPath(path);
    render(<MarketingPageView page={page} />);

    const root = document.querySelector(`[data-landing-page="${landing}"]`);
    expect(root).not.toBeNull();
    const modules = [...root!.querySelectorAll<HTMLElement>("[data-content-module]")];
    expect(modules.length).toBeGreaterThanOrEqual(8);
    expect(new Set(modules.map((section) => section.id)).size).toBe(modules.length);
    for (const section of modules) {
      expect(section.id).not.toBe("");
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-heading`);
    }
    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(page.hero.title);
    for (const sourceSection of page.sections) {
      const section = root!.querySelector<HTMLElement>(`section#${sourceSection.id}[data-content-module]`);
      expect(section, `${path}: missing ${sourceSection.id}`).not.toBeNull();
      expect(section).toHaveAttribute("aria-labelledby", `${sourceSection.id}-heading`);
      expect(within(section!).getByRole("heading", {level: 2, name: sourceSection.title})).toBeInTheDocument();
      if (sourceSection.body) expect(section).toHaveTextContent(sourceSection.body);
      for (const item of sourceSection.items ?? []) {
        expect(section, `${path}#${sourceSection.id}: missing ${item.title}`).toHaveTextContent(item.title);
        expect(section, `${path}#${sourceSection.id}: missing body for ${item.title}`).toHaveTextContent(item.body);
        if (item.meta) expect(section, `${path}#${sourceSection.id}: missing meta for ${item.title}`).toHaveTextContent(item.meta);
      }
    }

    const approved = new Set<string>(PUBLIC_PATHS);
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      expect(approved.has(anchor.getAttribute("href") ?? "")).toBe(true);
    }
    expect([...document.querySelectorAll<HTMLAnchorElement>("section#related-services a[href]")]
      .map((anchor) => anchor.getAttribute("href"))).toEqual(relatedPaths);
  });

  it.each([
    ["/ai/llm", "model-series"],
    ["/idc/gpu", "solution-detail"],
  ] as const)("keeps %s on its existing detail template", (path, templateClass) => {
    render(<MarketingPageView page={getPageByPath(path)} />);
    expect(document.querySelector("[data-landing-page]")).toBeNull();
    expect(document.querySelector(`.${templateClass}`)).not.toBeNull();
  });

  it("renders five linked hero states and keeps the detailed home sections", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);
    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1, name: "让大模型走进应用，让创意成为内容"})).toBeInTheDocument();
    const heroSlides = screen.getAllByTestId("home-hero-slide");
    expect(heroSlides.map((slide) => slide.getAttribute("data-domain"))).toEqual([
      "ai", "compute", "xinchang", "link", "energy",
    ]);
    expect(heroSlides.map((slide) => within(slide).getByRole("link").getAttribute("href"))).toEqual([
      "/ai", "/idc", "/madeinchina", "/network", "/energy",
    ]);
    expect(screen.getByRole("link", {name: "LLM与多模态理解"})).toHaveAttribute("href", "/ai/llm");
    expect(screen.getByRole("link", {name: "AI图像生成与编辑"})).toHaveAttribute("href", "/ai/image");
    expect(screen.getByRole("link", {name: "AI视频生成与编辑"})).toHaveAttribute("href", "/ai/video");
    const sectionIds = [...document.querySelectorAll("section[id]")].map((section) => section.id);
    expect(sectionIds.slice(0, 7)).toEqual(["ai", "idc", "madeinchina", "network", "energy", "delivery", "about"]);
    expect(screen.getByText(/实际可调用的型号及价格以平台目录为准/)).toBeInTheDocument();
  });

  it("uses the same five-domain taxonomy in hero states and numbered sections", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);

    expect(screen.getAllByTestId("home-hero-slide").map((slide) => slide.getAttribute("data-label"))).toEqual([
      "AI", "COMPUTE", "XINCHUANG", "LINK", "ENERGY",
    ]);
    expect(["ai", "idc", "madeinchina", "network", "energy"].map((id) =>
      document.querySelector(`#${id} .home-section__index`)?.textContent,
    )).toEqual(["01 / AI", "02 / COMPUTE", "03 / XINCHUANG", "04 / LINK", "05 / ENERGY"]);
  });

  it("renders every home business domain fully expanded without collapse controls", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);

    const ai = document.getElementById("ai");
    const compute = document.getElementById("idc");
    const xinchang = document.getElementById("madeinchina");
    const link = document.getElementById("network");
    const energy = document.getElementById("energy");

    expect(within(ai!).getByRole("heading", {level: 3, name: "模型生态"})).toBeInTheDocument();
    expect(within(ai!).getByText("DeepSeek")).toBeInTheDocument();
    expect(within(compute!).getByRole("link", {name: "VPS租赁"})).toBeInTheDocument();
    expect(within(compute!).getByRole("link", {name: "GPU算力"})).toBeInTheDocument();
    expect(within(xinchang!).getByRole("heading", {level: 3, name: "计算硬件与本地AI部署"})).toBeInTheDocument();
    expect(within(xinchang!).getByRole("heading", {level: 3, name: "数据保护与长期归档"})).toBeInTheDocument();
    expect(within(link!).getByRole("heading", {level: 3, name: "企业专线"})).toBeInTheDocument();
    expect(within(link!).getByRole("heading", {level: 3, name: "云网连接"})).toBeInTheDocument();
    expect(within(energy!).getByRole("heading", {level: 3, name: "绿电与绿证需求对接"})).toBeInTheDocument();
    expect(within(energy!).getByRole("heading", {level: 3, name: "碳资产相关服务对接"})).toBeInTheDocument();
    expect(document.querySelector("details")).toBeNull();
    expect(screen.queryByRole("button", {name: /展开|收起/})).not.toBeInTheDocument();
  });

  it("keeps a circular domain graphic beside every expanded business section", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);

    for (const id of ["ai", "idc", "madeinchina", "network", "energy"]) {
      const section = document.getElementById(id);
      expect(section?.querySelector(".home-domain__visual[aria-hidden='true']")).not.toBeNull();
    }
  });

  it("alternates the desktop heading and detail columns between business sections", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);

    expect(document.getElementById("madeinchina")).toHaveClass("home-domain--reverse");
    expect(document.getElementById("network")).not.toHaveClass("home-domain--reverse");
    expect(document.getElementById("energy")).toHaveClass("home-domain--reverse");
  });

  it("keeps the about page useful without fake contact controls", () => {
    render(<MarketingPageView page={getPageByPath("/about")} />);
    expect(screen.getByText(/成都光波互联科技有限公司成立于2019年/)).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "协作完成交付"})).toBeInTheDocument();
    expect(document.querySelector("section#contact")).toHaveAttribute("aria-labelledby", "contact-heading");
    expect(document.querySelector("form")).toBeNull();
    expect(screen.queryByRole("link", {name: /联系项目顾问|立即咨询/})).not.toBeInTheDocument();
  });

  it("keeps breadcrumbs off home and top-level landing pages, but shows them on detail pages", () => {
    for (const path of PUBLIC_PATHS) {
      const view = render(<MarketingPageView page={getPageByPath(path)} />);
      const parents = PUBLIC_PATHS.filter((candidate) => candidate !== "/" && path.startsWith(`${candidate}/`));
      if (parents.length === 0) {
        expect(screen.queryByRole("navigation", {name: "面包屑导航"})).not.toBeInTheDocument();
      } else {
        const nav = screen.getByRole("navigation", {name: "面包屑导航"});
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
      if (!document.querySelector("[data-landing-page]")) {
        for (const section of page.sections) {
          expect(document.getElementById(section.id)).toHaveAttribute("aria-labelledby", `${section.id}-heading`);
          const headingLevel = path === "/" && section.id === "model-ecosystem" ? 3 : 2;
          const renderedSection = document.getElementById(section.id);
          expect(within(renderedSection!).getByRole("heading", {level: headingLevel, name: section.title})).toBeInTheDocument();
          if (section.body) expect(within(renderedSection!).getByText(section.body)).toBeInTheDocument();
          for (const item of section.items ?? []) {
            expect(within(renderedSection!).getByRole("heading", {level: 3, name: item.title})).toBeInTheDocument();
            expect(within(renderedSection!).getAllByText(item.body, {exact: true}).length).toBeGreaterThan(0);
            if (item.meta) expect(within(renderedSection!).getAllByText(item.meta, {exact: true}).length).toBeGreaterThan(0);
          }
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

  it.each(["/ai", "/idc", "/network", "/about"] as const)("places representative %s landing content in server HTML", (path) => {
    const page = getPageByPath(path);
    const html = renderToStaticMarkup(<MarketingPageView page={page} />);
    const firstSection = page.sections[0];
    expect(html).toContain(`data-landing-page="${page.key}"`);
    expect(html).toContain(`id="${firstSection.id}"`);
    expect(html).toContain(firstSection.title);
    if (firstSection.body) expect(html).toContain(firstSection.body);
    if (firstSection.items?.[0]) {
      expect(html).toContain(firstSection.items[0].title);
      expect(html).toContain(firstSection.items[0].body);
    }
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
