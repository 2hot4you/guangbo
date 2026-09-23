import {describe, expect, it} from "vitest";
import {getPage, getPageByPath, marketingPages, PUBLIC_PATHS} from "@/content";

const serialized = JSON.stringify(marketingPages);

describe("visitor content", () => {
  it("provides substantive content for all 14 public pages", () => {
    expect(Object.keys(marketingPages)).toHaveLength(14);
    for (const path of PUBLIC_PATHS) {
      const page = getPageByPath(path);
      expect(getPage(page.key)).toBe(page);
      expect(page.path).toBe(path);
      expect(page.hero.title.length).toBeGreaterThan(4);
      expect(page.hero.lead.length).toBeGreaterThan(20);
      expect(page.sections.length).toBeGreaterThan(0);
      expect(page.contactEnabled).toBe(false);
    }
  });

  it("keeps internal notes and unfinished features off the site", () => {
    for (const forbidden of ["内部编辑说明", "不上站", "敬请期待", "/console", "/login", "立即生成", "按钮："]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it("does not expose unconfirmed contact methods", () => {
    expect(serialized).not.toMatch(/\b1[3-9]\d{9}\b/);
    expect(serialized).not.toContain("@guangbo");
    expect(serialized).not.toContain("环球中心W3区2011号");
  });

  it("preserves source heroes, model names and availability disclaimers", () => {
    expect(marketingPages.home.hero).toEqual({
      title: "让大模型走进应用，让创意成为内容",
      lead: "从LLM语言理解到AI生图、生视频，光波互联为开发者与企业梳理国内外模型能力，提供API服务入口与接入咨询。以模型能力连接应用，以算力、网络和绿色能源支撑业务发展。",
    });
    expect(serialized).toContain("模型名称用于能力介绍，实际可调用的型号及价格以平台目录为准。");
    expect(marketingPages.aiLlm.sections.find((section) => section.id === "international-models")?.body)
      .toContain("此处介绍模型系列，不表示所有分支均已在平台开放。");
    expect(serialized).toContain("腾讯混元HY");
  });

  it("keeps the overview visitor-facing without directing readers to an unavailable catalog", () => {
    expect(marketingPages.home.sections[0].title).toBe("大模型与AIGC");
    const ecosystem = marketingPages.ai.sections.find((section) => section.id === "ecosystem");
    expect(ecosystem?.body).not.toContain("请查看可用模型目录");
    expect(ecosystem?.body).toContain("当前可调用型号、开放能力及价格");
    expect(marketingPages.ai.hero.lead).toContain("API接入咨询");
    expect(marketingPages.ai.hero.lead).not.toContain("使用管理入口");
  });

  it("retains representative inner heroes and complete first modules from the source", () => {
    expect(marketingPages.aiImage.hero).toEqual({
      title: "将文字创意转为视觉素材",
      lead: "从文字描述、商品图片或设计参考出发，选择适合的图像模型。围绕内容生成与素材编辑，帮助团队组织营销图片、创意草图和多版本设计素材。",
    });
    expect(marketingPages.aiImage.sections[0]).toMatchObject({
      title: "常见创作方式",
      items: [
        {title: "文生图", body: "用文字描述主体、场景、构图和风格，生成视觉草稿或内容素材。"},
        {title: "参考图生成", body: "在支持参考输入的模型中，用图片辅助表达人物、商品或画面风格。"},
        {title: "图像编辑", body: "按型号支持的范围调整背景、局部元素或整体效果。"},
        {title: "版本探索", body: "围绕同一创意尝试不同构图与表达，再进行筛选和后期加工。"},
      ],
    });
    expect(marketingPages.idcGpu.hero).toEqual({
      title: "面向AI与行业计算，组合所需算力",
      lead: "围绕模型训练、推理服务、图形渲染及行业计算，提供GPU算力租赁与部署方案对接。从任务特点出发，同步考虑GPU、显存、存储、网络和运行环境。",
    });
    expect(marketingPages.idcGpu.sections[0]).toMatchObject({
      title: "以任务决定配置",
      items: [
        {title: "模型训练与微调", body: "结合模型规模、数据集和训练方式，评估显存容量、多卡协同与数据读取需求。"},
        {title: "推理服务", body: "围绕模型大小、响应需求和并发负载，选择计算资源及部署方式。"},
        {title: "图形与行业计算", body: "结合渲染或计算软件的适配情况，评估设备和运行环境。"},
      ],
    });
    expect(marketingPages.madeInChina.hero).toEqual({
      title: "从软硬件选型，到业务系统落地",
      lead: "围绕企业计算环境、业务应用和数据保护，光波互联结合合作生态开展方案对接与系统集成。以现有系统和业务目标为起点，评估软硬件适配、部署方式及后续扩展。",
    });
    expect(marketingPages.madeInChina.sections[0]).toMatchObject({
      title: "计算硬件与本地AI部署",
      body: "从桌面工作站、企业服务器到多卡计算节点，按任务规模与现场条件组织选型。针对本地模型推理、知识检索和行业计算，综合评估处理器、GPU、内存、存储与网络，明确软件环境及适配要求。面向信创需求，按项目逐项核对处理器、操作系统、数据库与业务软件的兼容情况，形成可验证的配置清单。",
    });
    expect(marketingPages.about.hero).toEqual({
      title: "以光为媒，连接世界；以算为基，赋能未来",
      lead: "成都光波互联科技有限公司成立于2019年，围绕光纤网络、数据中心互联、算力租赁和系统研发集成开展业务，为企业数字化建设提供资源连接与技术服务。",
    });
    expect(marketingPages.about.sections[0]).toMatchObject({
      title: "连接资源，也连接业务需求",
      body: "我们从客户的业务场景出发，将网络、计算、托管和系统集成需求放在一起考虑。结合合作生态资源，组织选型与方案沟通，让基础设施配置更贴近应用需求。",
    });
  });

  it("keeps links within the approved public paths", () => {
    const known = new Set(PUBLIC_PATHS);
    for (const page of PUBLIC_PATHS.map(getPageByPath)) {
      for (const section of page.sections) {
        for (const item of section.items ?? []) {
          if (item.href) expect(known.has(item.href)).toBe(true);
        }
      }
    }
  });
});
