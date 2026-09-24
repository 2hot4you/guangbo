import {cleanup, render, screen, within} from "@testing-library/react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it} from "vitest";
import {
  LandingHero,
  LandingSection,
  NumberedList,
  ProcessRail,
  VisualPlaceholder,
} from "@/components/marketing/landing-page-primitives";

afterEach(cleanup);

describe("landing page primitives", () => {
  it("renders one h1 and labelled, addressable content modules", () => {
    render(
      <>
        <LandingHero id="intro" eyebrow="AI / 01" title="模型能力" lead="按任务选型。" />
        <LandingSection id="workflow" title="工作流程" body="从需求开始。">
          <p>验证样例</p>
        </LandingSection>
      </>,
    );

    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1, name: "模型能力"})).toBeInTheDocument();
    expect(document.getElementById("intro")).toHaveAttribute("aria-labelledby", "intro-heading");
    expect(document.getElementById("workflow")).toHaveAttribute("aria-labelledby", "workflow-heading");
    expect(screen.getByRole("heading", {level: 2, name: "工作流程"})).toBeInTheDocument();
    expect(document.querySelectorAll("[data-content-module]")).toHaveLength(2);
  });

  it("keeps placeholder labels and descriptions readable in server HTML", () => {
    const html = renderToStaticMarkup(
      <VisualPlaceholder label="基础设施示意" description="机房资源图片待确认" />,
    );
    render(<VisualPlaceholder label="基础设施示意" description="机房资源图片待确认" />);

    const figure = screen.getByRole("figure", {name: "基础设施示意"});
    expect(within(figure).getByText("机房资源图片待确认")).toBeInTheDocument();
    expect(html).toContain("基础设施示意");
    expect(html).toContain("机房资源图片待确认");
  });

  it("keeps the title and lead before a split hero visual in server reading order", () => {
    const html = renderToStaticMarkup(
      <LandingHero id="intro" title="模型能力" lead="按任务选型。" layout="split" compact>
        <figure aria-label="能力示意"><figcaption>从任务到输出</figcaption></figure>
      </LandingHero>,
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const hero = document.getElementById("intro")!;
    expect(hero.querySelectorAll("h1")).toHaveLength(1);
    expect(hero.textContent).toBe("模型能力按任务选型。从任务到输出");
    expect(hero.querySelector("h1")!.compareDocumentPosition(hero.querySelector("figure")!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("renders numbered choices and process steps as ordered lists", () => {
    render(
      <>
        <NumberedList items={[{title: "确认目标", body: "明确业务负载"}, {title: "比较方案", body: "验证条件"}]} />
        <ProcessRail items={[{title: "沟通需求", body: "准备输入"}, {title: "方案确认", body: "核对资源"}]} />
      </>,
    );

    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(2);
    expect(lists.every((list) => list.tagName === "OL")).toBe(true);
    expect(within(lists[0]).getAllByRole("listitem")).toHaveLength(2);
    expect(within(lists[1]).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("明确业务负载")).toBeInTheDocument();
    expect(screen.getByText("核对资源")).toBeInTheDocument();
  });
});
