import {cleanup, render, screen, within} from "@testing-library/react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it} from "vitest";
import {AiLandingPage} from "@/components/marketing/ai-landing-page";
import {IdcLandingPage} from "@/components/marketing/idc-landing-page";
import {ai} from "@/content/pages/ai";
import {idc} from "@/content/pages/idc";

afterEach(cleanup);

describe("distinct AI and IDC landing pages", () => {
  it("uses a light IDC hero and moves emphasis to the service matrix", () => {
    render(<IdcLandingPage page={idc} />);
    expect(document.getElementById("hero")).toHaveAttribute("data-tone", "light");
    expect(document.getElementById("service-matrix")).toHaveAttribute("data-tone", "dark");
  });

  it.each([
    {name: "AI", page: ai, Component: AiLandingPage, rootClass: "ai-landing"},
    {name: "IDC", page: idc, Component: IdcLandingPage, rootClass: "idc-landing"},
  ])("renders $name with one H1 and every declared section as an addressable module", ({page, Component, rootClass}) => {
    render(<Component page={page} />);

    const root = document.querySelector("[data-landing-page]");
    expect(root).toHaveClass(rootClass);
    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(page.hero.title);

    const modules = [...root!.querySelectorAll<HTMLElement>("section[data-content-module]")];
    expect(modules).toHaveLength(9);
    expect(modules.map((contentModule) => contentModule.id)).toEqual(["hero", ...page.sections.map((section) => section.id)]);
    expect(new Set(modules.map((contentModule) => contentModule.id)).size).toBe(modules.length);

    const serverDocument = new DOMParser().parseFromString(renderToStaticMarkup(<Component page={page} />), "text/html");
    expect(serverDocument.querySelector("#hero")?.textContent).toContain(page.hero.lead);
    for (const section of page.sections) {
      const contentModule = document.getElementById(section.id);
      const serverModule = serverDocument.getElementById(section.id);
      expect(contentModule).toHaveAttribute("aria-labelledby", `${section.id}-heading`);
      expect(within(contentModule!).getByRole("heading", {level: 2, name: section.title})).toBeInTheDocument();
      expect(serverModule).not.toBeNull();
      expect(serverModule!.textContent).toContain(section.title);
      if (section.body) {
        expect(within(contentModule!).getByText(section.body, {exact: true})).toBeInTheDocument();
        expect(serverModule!.textContent).toContain(section.body);
      }
      for (const item of section.items ?? []) {
        const heading = within(contentModule!).getByRole("heading", {level: 3, name: item.title});
        const itemContainer = heading.closest("article, li");
        expect(itemContainer).not.toBeNull();
        expect(within(itemContainer as HTMLElement).getByText(item.body, {exact: true})).toBeInTheDocument();
        expect(serverModule!.textContent).toContain(item.title);
        expect(serverModule!.textContent).toContain(item.body);
        if ("meta" in item && item.meta) {
          expect(within(itemContainer as HTMLElement).getByText(item.meta, {exact: false})).toBeInTheDocument();
          expect(serverModule!.textContent).toContain(item.meta);
        }
      }
    }
  });

  it("presents AI capabilities, model families, workflow, selection and availability as separate structures", () => {
    render(<AiLandingPage page={ai} />);

    const capabilities = document.getElementById("capability-map")!;
    expect(within(capabilities).getAllByRole("link")).toHaveLength(3);
    expect(within(capabilities).getByRole("link", {name: /LLM与多模态理解/})).toHaveAttribute("href", "/ai/llm");
    expect(within(capabilities).getByRole("link", {name: /图像生成与编辑/})).toHaveAttribute("href", "/ai/image");
    expect(within(capabilities).getByRole("link", {name: /视频生成与编辑/})).toHaveAttribute("href", "/ai/video");
    expect([...capabilities.querySelectorAll("article")]).toHaveLength(3);
    expect([...capabilities.querySelectorAll("article")].every((row) => row.classList.contains("grid"))).toBe(true);
    const ecosystem = document.getElementById("ecosystem")!;
    expect(within(ecosystem).getAllByRole("heading", {level: 3})).toHaveLength(4);
    expect(ecosystem.querySelector(".md\\:grid-cols-2")).not.toBeNull();
    expect(within(document.getElementById("workflows")!).getByRole("list", {name: "模型任务工作流"})).toBeInTheDocument();
    expect(within(document.getElementById("selection")!).getAllByRole("listitem")).toHaveLength(5);
    expect(within(document.getElementById("availability")!).getByText(/实际开放型号与价格以平台目录为准/)).toBeInTheDocument();
    const heroGraphic = screen.getByRole("figure", {name: "模型能力轨道图"});
    expect(heroGraphic).toBeInTheDocument();
    expect(within(heroGraphic).getByText("LLM")).toBeInTheDocument();
    expect(within(heroGraphic).getByText("IMAGE")).toBeInTheDocument();
    expect(within(heroGraphic).getByText("VIDEO")).toBeInTheDocument();
    expect(renderToStaticMarkup(<AiLandingPage page={ai} />)).toContain("模型任务工作流");
  });

  it("presents IDC service choices, workloads, infrastructure layers and delivery conditions", () => {
    render(<IdcLandingPage page={idc} />);

    const matrix = document.getElementById("service-matrix")!;
    expect(within(matrix).getAllByRole("link")).toHaveLength(4);
    expect(within(matrix).getByRole("link", {name: /VPS租赁/})).toHaveAttribute("href", "/idc/vps");
    expect(within(matrix).getByRole("link", {name: /GPU算力/})).toHaveAttribute("href", "/idc/gpu");
    expect([...matrix.querySelectorAll("article")]).toHaveLength(4);
    expect(matrix.querySelector(".xl\\:grid-cols-4")).not.toBeNull();
    expect(within(document.getElementById("workload-map")!).getByRole("figure", {name: "业务负载与资源匹配图"})).toBeInTheDocument();
    const stack = document.getElementById("infrastructure-stack")!;
    expect(within(stack).getByRole("list", {name: "五层基础设施条件"})).toBeInTheDocument();
    expect(within(stack).getAllByRole("listitem")).toHaveLength(5);
    expect(within(document.getElementById("migration")!).getByRole("list", {name: "迁移与扩容步骤"})).toBeInTheDocument();
    expect(within(document.getElementById("delivery")!).getByText(/具体配置及服务指标以选定节点和交付方案为准/)).toBeInTheDocument();
    const heroGraphic = screen.getByRole("figure", {name: "IDC五层基础设施动态示意"});
    for (const layer of ["COMPUTE", "STORAGE", "NETWORK", "POWER", "COOLING"]) {
      expect(within(heroGraphic).getByText(layer)).toBeInTheDocument();
    }
    expect(renderToStaticMarkup(<IdcLandingPage page={idc} />)).toContain("业务负载与资源匹配图");
  });
});
