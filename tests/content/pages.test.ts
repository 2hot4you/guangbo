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
    expect(serialized).toContain("此处介绍模型系列，不表示所有分支均已在平台开放。");
    expect(serialized).toContain("腾讯混元HY");
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
