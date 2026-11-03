import {cleanup, render, screen, within} from "@testing-library/react";
import {afterEach, describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {getPageByPath, getRouteByPath, PUBLIC_PATHS} from "@/content";
import type {ResourceCard} from "@/content";
import {BareMetalResourceCards} from "@/components/marketing/bare-metal-resource-cards";
import {MarketingPageView} from "@/components/marketing/marketing-page";
import {bareMetalResources} from "@/content/resources/bare-metal";
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

  it("renders one carousel and both complete model catalog lanes above the preserved home sections", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);
    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1, name: "让大模型走进应用，让创意成为内容"})).toBeInTheDocument();
    const carousel = screen.getByRole("region", {name: "光波互联业务轮播"});
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    expect(carousel).toHaveAttribute("data-domain", "ai");
    expect(within(carousel).getByRole("link", {name: /探索大模型/})).toHaveAttribute("href", "/ai");
    expect(within(carousel).getByRole("navigation", {name: "业务领域进度"}).querySelectorAll("button")).toHaveLength(5);
    expect(within(carousel).getAllByRole("button", {name: /转到 .+ 业务/}).map((button) => button.getAttribute("aria-label"))).toEqual([
      "转到 AI 业务", "转到 COMPUTE 业务", "转到 XINCHUANG 业务", "转到 LINK 业务", "转到 ENERGY 业务",
    ]);
    expect(screen.getByRole("link", {name: "LLM与多模态理解"})).toHaveAttribute("href", "/ai/llm");
    expect(screen.getByRole("link", {name: "AI图像生成与编辑"})).toHaveAttribute("href", "/ai/image");
    expect(screen.getByRole("link", {name: "AI视频生成与编辑"})).toHaveAttribute("href", "/ai/video");
    const sectionIds = [...document.querySelectorAll("section[id]")].map((section) => section.id);
    expect(sectionIds.slice(0, 7)).toEqual(["ai", "idc", "madeinchina", "network", "energy", "delivery", "about"]);
    expect(screen.getByText("PROVIDERS / 136")).toBeInTheDocument();
    expect(screen.getByText("MODELS / 72")).toBeInTheDocument();
    expect(within(screen.getByRole("region", {name: "AI Providers"})).getAllByRole("listitem")).toHaveLength(136);
    expect(within(screen.getByRole("region", {name: "AI Models"})).getAllByRole("listitem")).toHaveLength(72);
    expect(document.querySelector(".home-models__names")).toBeNull();
    expect(screen.getByText(/实际可调用的型号及价格以平台目录为准/)).toBeInTheDocument();
  });

  it("uses the same five-domain taxonomy in carousel controls and numbered sections", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);

    expect(within(screen.getByRole("navigation", {name: "业务领域进度"})).getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toEqual([
      "转到 AI 业务", "转到 COMPUTE 业务", "转到 XINCHUANG 业务", "转到 LINK 业务", "转到 ENERGY 业务",
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
    expect(within(ai!).getAllByText("DeepSeek").length).toBeGreaterThan(0);
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

  it("keeps breadcrumbs off every public page", () => {
    for (const path of PUBLIC_PATHS) {
      const view = render(<MarketingPageView page={getPageByPath(path)} />);
      expect(screen.queryByRole("navigation", {name: "面包屑导航"})).not.toBeInTheDocument();
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

  it("groups every specification for one bare-metal resource inside a single resource card", () => {
    const page = getPageByPath("/idc/bare-metal");
    render(<MarketingPageView page={page} />);

    const resource = document.getElementById("available-resource");
    expect(resource).not.toBeNull();
    expect(within(resource!).getByRole("heading", {level: 2, name: "裸金属资源配置"})).toBeInTheDocument();

    const cards = within(resource!).getAllByRole("article");
    expect(cards).toHaveLength(3);
    const card = within(resource!).getByRole("article", {name: "DeepBlue Server"});
    expect(within(card).getByRole("heading", {level: 3, name: "DeepBlue Server"})).toBeInTheDocument();
    expect(card).toHaveTextContent("Intel® Xeon® Gold 6133");
    expect(card).toHaveTextContent("2.5 GHz、20 核 40 线程");
    expect(card).toHaveTextContent("RTX 3090 涡轮版 × 2");
    expect(card).toHaveTextContent("DDR4 512 GB（64 GB × 8）");
    expect(card).toHaveTextContent("480 GB M.2 SSD × 1");
    expect(card).toHaveTextContent("4 TB U.2 NVMe SSD（2.5 英寸）× 1");
    expect(card).toHaveTextContent("1GbE 电口 × 1");
    expect(card).toHaveTextContent("10GbE 光口 × 4");
    expect(card).toHaveTextContent("CentOS 7.9");
    expect(card).toHaveTextContent("Edgeray IaaS");
    expect(card).toHaveTextContent("整机双卡参考价 ¥1,200/月");
    expect(card).toHaveTextContent("单卡参考价 ¥600/月或 ¥20/天");
    expect(card).toHaveTextContent("LoRA");
    expect(card).toHaveTextContent("Stable Diffusion");
    expect(card).toHaveTextContent("SDXL");
    expect(card).toHaveTextContent("Flux");
    expect(card).toHaveTextContent("RAG");
    expect(card).toHaveTextContent("视频剪辑、渲染及 3D 建模");
    expect(card).toHaveTextContent("15390073913");
    expect(card).toHaveTextContent("19382091612");
    expect(card).toHaveTextContent("库存、价格、端口与开通条件以实际确认为准");

    const html = renderToStaticMarkup(<MarketingPageView page={page} />);
    expect(html).toContain("DeepBlue Server");
    expect(html).not.toContain("bz-4002");
    expect(html).toContain("15390073913");
    expect(html).toContain("19382091612");
  });

  it.each([
    ["H200 8卡集群节点", [
      "128 台", "IB", "风冷", "五年合作周期", "¥170,000/台/月", "可议价",
      "2 × Intel Xeon Platinum 8558", "48 核", "96 线程", "2.1GHz",
      "32 × 64GB", "DDR5-5600 ECC RDIMM", "2TB", "实际运行速率以平台配置为准",
      "1 × 960GB", "2 × 3.84TB", "U.2 NVMe PCIe 5.0", "企业级 SSD",
      "8 × NVIDIA H200 SXM 141GB HBM3e", "8 × NVIDIA ConnectX-7 200Gb/s",
      "GPU Direct RDMA", "1 × NVIDIA ConnectX-6 100Gb/s", "6 × 3000W", "钛金",
      "8U", "加固", "风扇墙", "导轨", "免工具维护", "3 年", "7×24", "上门维护", "硬件响应", "系统调优", "驱动升级",
    ], ["¥16,500/月", "¥13,500/月"]],
    ["8× RTX 5090 裸金属节点", [
      "128 台", "西南", "1 个月", "2 × Intel Xeon Gold 6530", "8 × 64GB", "DDR5", "512GB",
      "1 × 960GB", "1 × 3.84TB", "25Gb", "双口", "8 × RTX 5090 32GB", "涡轮", "4 × 2500W",
      "机房", "电", "网", "最低", "¥16,500/月", "¥13,500/月", "自备",
    ], ["¥170,000/台/月", "4090"]],
  ] as const)("renders complete isolated details for %s", (name, values, excluded) => {
    render(<MarketingPageView page={getPageByPath("/idc/bare-metal")} />);
    const resource = document.getElementById("available-resource")!;
    const card = within(resource).getByRole("article", {name});
    for (const value of values) expect(card).toHaveTextContent(value);
    for (const value of excluded) expect(card).not.toHaveTextContent(value);
    expect(card).toHaveTextContent("以实际确认为准");
    if (name === "8× RTX 5090 裸金属节点") {
      const pricing = within(card).getByRole("region", {name: "参考租赁价格"});
      const rows = [...pricing.querySelectorAll("p")];
      expect(rows.some((row) => /机房/.test(row.textContent ?? "") && /¥16,500\/月/.test(row.textContent ?? "") && /最低/.test(row.textContent ?? ""))).toBe(true);
      expect(rows.some((row) => /自备/.test(row.textContent ?? "") && /¥13,500\/月/.test(row.textContent ?? "") && /最低/.test(row.textContent ?? ""))).toBe(true);
    }
    expect(card).not.toHaveTextContent("咨询");
    expect(card).not.toHaveTextContent("15390073913");
    expect(card).not.toHaveTextContent("19382091612");
  });

  it("keeps multiple bare-metal resources isolated in their own cards", () => {
    const secondResource: ResourceCard = {
      id: "resource-two",
      name: "测试资源 B",
      category: "计算裸金属",
      meta: "测试资源 B 元信息",
      summary: "测试资源 B 摘要",
      specifications: [{label: "处理器", value: "测试资源 B 处理器"}],
      pricing: [{label: "整机", value: "测试资源 B 价格"}],
      workloads: "测试资源 B 适用任务",
      contacts: ["测试资源 B 咨询"],
      notice: "测试资源 B 交付说明",
    };

    render(<BareMetalResourceCards resources={[bareMetalResources[0], secondResource]} />);

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    const deepBlue = screen.getByRole("article", {name: "DeepBlue Server"});
    const resourceTwo = screen.getByRole("article", {name: "测试资源 B"});
    expect(deepBlue).toHaveTextContent("RTX 3090 涡轮版 × 2");
    expect(deepBlue).toHaveTextContent("15390073913");
    expect(deepBlue).not.toHaveTextContent("测试资源 B 处理器");
    expect(resourceTwo).toHaveTextContent("测试资源 B 处理器");
    expect(resourceTwo).toHaveTextContent("测试资源 B 价格");
    expect(resourceTwo).toHaveTextContent("测试资源 B 咨询");
    expect(resourceTwo).toHaveTextContent("测试资源 B 交付说明");
    expect(resourceTwo).not.toHaveTextContent("RTX 3090 涡轮版 × 2");
  });

  it("promotes a concise DeepBlue Server resource in the home compute section without exposing its internal SKU", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);

    const compute = document.getElementById("idc");
    expect(compute).not.toBeNull();
    const card = within(compute!).getByRole("article", {name: "DeepBlue Server"});
    expect(card).toHaveTextContent("双 RTX 3090 GPU 裸金属资源，可评估用于大模型推理、LoRA、图像生成、视频处理与渲染等计算任务");
    expect(card).toHaveTextContent("双路 Intel® Xeon® Gold 6133");
    expect(card).toHaveTextContent("RTX 3090 涡轮版 × 2");
    expect(card).toHaveTextContent("DDR4 512 GB");
    expect(card).toHaveTextContent("4 TB U.2 NVMe SSD");
    expect(card).toHaveTextContent("整机双卡参考价 ¥1,200/月");
    expect(card).toHaveTextContent("单卡参考价 ¥600/月或 ¥20/天");
    expect(within(card).getByRole("region", {name: "参考租赁价格"})).toBeInTheDocument();
    expect(card).toHaveTextContent("15390073913");
    expect(card).toHaveTextContent("19382091612");
    expect(card).toHaveTextContent("库存、价格、端口与开通条件以实际确认为准");
    expect(within(card).getByRole("link", {name: "查看 DeepBlue Server 详情"})).toHaveAttribute("href", "/idc/bare-metal");
    expect(card).not.toHaveTextContent("1GbE 电口");
    expect(card).not.toHaveTextContent("Edgeray IaaS");

    const homeHtml = renderToStaticMarkup(<MarketingPageView page={getPageByPath("/")} />);
    const detailHtml = renderToStaticMarkup(<MarketingPageView page={getPageByPath("/idc/bare-metal")} />);
    for (const html of [homeHtml, detailHtml]) {
      expect(html).toContain("DeepBlue Server");
      expect(html).not.toContain("bz-4002");
    }
  });

  it("renders three separate resource summaries in the home compute section", () => {
    render(<MarketingPageView page={getPageByPath("/")} />);
    const compute = document.getElementById("idc")!;
    expect(within(compute).getAllByRole("article")).toHaveLength(3);
    const cases = [
      {name: "DeepBlue Server", summary: "双 RTX 3090 GPU 裸金属资源", specs: ["Intel® Xeon® Gold 6133", "RTX 3090", "512 GB", "4 TB"], prices: ["¥1,200/月", "¥600/月"], excluded: ["¥170,000/台/月", "¥16,500/月", "¥13,500/月"]},
      {name: "H200 8卡集群节点", summary: "128 台", specs: ["Intel Xeon Platinum 8558", "H200", "2TB", "ConnectX-7"], prices: ["¥170,000/台/月"], excluded: ["¥1,200/月", "¥16,500/月", "¥13,500/月"]},
      {name: "8× RTX 5090 裸金属节点", summary: "128 台", specs: ["Intel Xeon Gold 6530", "RTX 5090", "512GB", "25Gb"], prices: ["¥16,500/月", "¥13,500/月"], excluded: ["¥1,200/月", "¥170,000/台/月"]},
    ];
    for (const {name, summary, specs, prices, excluded} of cases) {
      const card = within(compute).getByRole("article", {name});
      expect(card.querySelector(".home-idc__resource-summary")).toHaveTextContent(summary);
      const specifications = card.querySelector(".home-idc__resource-specs")!;
      expect(specifications.querySelectorAll("dt")).toHaveLength(4);
      for (const value of specs) expect(specifications).toHaveTextContent(value);
      for (const value of prices) expect(card).toHaveTextContent(value);
      for (const value of excluded) expect(card).not.toHaveTextContent(value);
      expect(within(card).getByRole("link", {name: `查看 ${name} 详情`})).toHaveAttribute("href", "/idc/bare-metal");
      if (name !== "DeepBlue Server") expect(card).not.toHaveTextContent("咨询");
    }
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
    const otn = document.getElementById("otn");
    expect(otn).not.toBeNull();
    expect(within(otn!).getByText(/以本地接入、区域汇聚和骨干传输组织可选链路/)).toBeInTheDocument();
    expect(within(otn!).getByRole("figure", {name: "站点连接结构"})).toBeInTheDocument();
    const route = within(otn!).getByRole("list", {name: "站点连接路径"});
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
