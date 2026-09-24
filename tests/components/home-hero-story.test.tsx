import {act, cleanup, fireEvent, render, screen, within} from "@testing-library/react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";
import {HomeHeroStory} from "@/components/marketing/home-hero-story";
import {HomeHeroVisual} from "@/components/marketing/home-hero-visual";
import type {HomeHeroSlideContent} from "@/components/marketing/home-hero-story";

const slides = [
  {index: "01", label: "AI", title: "大模型与AIGC", body: "模型连接应用。", href: "/ai", cta: "探索大模型", variant: "ai"},
  {index: "02", label: "COMPUTE", title: "IDC与算力", body: "算力承载业务。", href: "/idc", cta: "查看IDC与算力", variant: "compute"},
  {index: "03", label: "XINCHUANG", title: "信创与企业数字化", body: "系统适配业务。", href: "/madeinchina", cta: "了解信创与数字化", variant: "xinchang"},
  {index: "04", label: "LINK", title: "专线网络", body: "网络连接站点。", href: "/network", cta: "查看专线网络", variant: "link"},
  {index: "05", label: "ENERGY", title: "绿电与清洁能源", body: "能源支持增长。", href: "/energy", cta: "了解清洁能源", variant: "energy"},
] as const satisfies readonly HomeHeroSlideContent[];
const originalScrollIntoView = Element.prototype.scrollIntoView;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalScrollIntoView) Element.prototype.scrollIntoView = originalScrollIntoView;
  else Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

describe("home hero story", () => {
  it("server-renders five ordered business states with one h1 and five real links", () => {
    const html = renderToStaticMarkup(<HomeHeroStory slides={slides} />);
    render(<HomeHeroStory slides={slides} />);

    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getAllByTestId("home-hero-slide").map((slide) => slide.dataset.domain))
      .toEqual(["ai", "compute", "xinchang", "link", "energy"]);
    expect(within(screen.getByTestId("home-hero-story")).getAllByRole("link")
      .map((link) => link.getAttribute("href")))
      .toEqual(["/ai", "/idc", "/madeinchina", "/network", "/energy"]);
    expect(html).toContain("大模型与AIGC");
    expect(html).toContain("绿电与清洁能源");
  });

  it("keeps all slides readable when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<HomeHeroStory slides={slides} />);

    expect(screen.getByTestId("home-hero-story")).toHaveAttribute("data-enhanced", "false");
    const articles = screen.getAllByTestId("home-hero-slide");
    expect(articles).toHaveLength(5);
    for (const article of articles) {
      expect(article).not.toHaveAttribute("aria-hidden");
      expect(within(article).getByRole("heading")).toBeInTheDocument();
      expect(within(article).getByRole("link")).toBeInTheDocument();
    }
  });

  it.each([
    ["ai", "AI", ["LLM", "IMAGE", "VIDEO"], ["ai-orbit", "ai-core"]],
    ["compute", "COMPUTE", ["COMPUTE", "STORAGE", "NETWORK", "POWER", "COOLING"], ["compute-track-forward", "compute-track-reverse"]],
    ["xinchang", "XINCHUANG", ["硬件", "系统", "应用", "数据"], ["xinchang-system"]],
    ["link", "LINK", ["站点", "接入", "传输", "目标"], ["link-signal"]],
    ["energy", "ENERGY", ["负荷", "绿电", "储能", "管理"], ["energy-core", "energy-flow"]],
  ] as const)("renders the %s visual as a labelled figure with readable nodes and its own motion", (variant, label, nodes, motions) => {
    render(<HomeHeroVisual variant={variant} active />);
    const figure = screen.getByRole("figure", {name: `${label}业务动态图形`});
    expect([...figure.querySelectorAll("[data-visual-node]")].map((node) => node.textContent))
      .toEqual(nodes);
    expect([...figure.querySelectorAll("[data-motion-kind]")].map((node) => node.getAttribute("data-motion-kind")))
      .toEqual(motions);
    for (const layer of figure.querySelectorAll("[data-motion-kind]")) {
      expect(layer).toHaveAttribute("data-motion-layer");
    }
  });

  it("keeps one accessible page h1 after a later state becomes active", () => {
    let callback: IntersectionObserverCallback | undefined;
    class Observer {
      constructor(receive: IntersectionObserverCallback) { callback = receive; }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", Observer);
    render(<HomeHeroStory slides={slides} />);
    const steps = [...screen.getByTestId("home-hero-story").querySelectorAll<HTMLElement>("[data-home-hero-step]")];
    steps.forEach((step, index) => {
      vi.spyOn(step, "getBoundingClientRect").mockReturnValue({
        top: index === 3 ? 200 : 1200 + index * 400,
        bottom: index === 3 ? 600 : 1600 + index * 400,
      } as DOMRect);
    });
    act(() => callback?.([], {} as IntersectionObserver));

    expect(screen.getAllByTestId("home-hero-slide")[3]).toHaveAttribute("data-active", "true");
    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("大模型与AIGC");
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("offers the five progress controls as an ordered list with a current step", () => {
    render(<HomeHeroStory slides={slides} />);
    const progress = screen.getByRole("navigation", {name: "业务领域进度"});
    const list = within(progress).getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    expect(within(list).getAllByRole("button")[0]).toHaveAttribute("aria-current", "step");
  });

  it("enhances with observed steps and moves to a requested state without moving focus", () => {
    let callback: IntersectionObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    class Observer {
      constructor(receive: IntersectionObserverCallback) { callback = receive; }
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal("IntersectionObserver", Observer);
    vi.stubGlobal("matchMedia", vi.fn(() => ({matches: true})));
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<HomeHeroStory slides={slides} />);

    const story = screen.getByTestId("home-hero-story");
    const steps = [...story.querySelectorAll<HTMLElement>("[data-home-hero-step]")];
    expect(observe).toHaveBeenCalledTimes(5);
    steps.forEach((step, index) => {
      vi.spyOn(step, "getBoundingClientRect").mockReturnValue({
        top: index === 2 ? 200 : 1200 + index * 400,
        bottom: index === 2 ? 600 : 1600 + index * 400,
      } as DOMRect);
    });
    act(() => callback?.([], {} as IntersectionObserver));
    expect(story).toHaveAttribute("data-enhanced", "true");
    expect(screen.getAllByTestId("home-hero-slide").map((slide) => slide.getAttribute("data-active")))
      .toEqual(["false", "false", "true", "false", "false"]);
    expect(screen.getAllByTestId("home-hero-slide")[0]).toHaveAttribute("aria-hidden", "true");

    const button = screen.getByRole("button", {name: /05.*ENERGY/});
    button.focus();
    fireEvent.click(button);
    expect(scrollIntoView).toHaveBeenCalledWith({block: "center", behavior: "auto"});
    expect(document.activeElement).toBe(button);
  });
});
