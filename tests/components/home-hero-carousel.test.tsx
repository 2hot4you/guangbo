import {readFileSync} from "node:fs";
import {join} from "node:path";
import {act, cleanup, createEvent, fireEvent, render, screen, within} from "@testing-library/react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {HomeHeroCarousel} from "@/components/marketing/home-hero-carousel";
import type {HomeHeroSlideContent} from "@/components/marketing/home-hero-types";

const slides = [
  {index: "01", label: "AI", title: "大模型与AIGC", body: "模型连接应用。", href: "/ai", cta: "探索大模型", variant: "ai"},
  {index: "02", label: "COMPUTE", title: "IDC与算力", body: "算力承载业务。", href: "/idc", cta: "查看IDC与算力", variant: "compute"},
  {index: "03", label: "XINCHUANG", title: "信创与企业数字化", body: "系统适配业务。", href: "/madeinchina", cta: "了解信创与数字化", variant: "xinchang"},
  {index: "04", label: "LINK", title: "专线网络", body: "网络连接站点。", href: "/network", cta: "查看专线网络", variant: "link"},
  {index: "05", label: "ENERGY", title: "绿电与清洁能源", body: "能源支持增长。", href: "/energy", cta: "了解清洁能源", variant: "energy"},
] as const satisfies readonly HomeHeroSlideContent[];

let motionMatches = false;
let motionListener: ((event: MediaQueryListEvent) => void) | undefined;

beforeEach(() => {
  vi.useFakeTimers();
  motionMatches = false;
  motionListener = undefined;
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() { return motionMatches; },
    addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => { motionListener = listener; },
    removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      if (motionListener === listener) motionListener = undefined;
    },
  })));
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function heading(): HTMLElement {
  return screen.getByRole("heading", {level: 1});
}

function advance(ms = 6000): void {
  act(() => vi.advanceTimersByTime(ms));
}

describe("home hero carousel", () => {
  it("server-renders the AI state with one H1, real CTA and labelled region", () => {
    const html = renderToStaticMarkup(<HomeHeroCarousel slides={slides} />);
    render(<HomeHeroCarousel slides={slides} />);

    expect(screen.getByRole("region", {name: "光波互联业务轮播"})).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(heading()).toHaveTextContent("大模型与AIGC");
    expect(screen.getByRole("link", {name: /探索大模型/})).toHaveAttribute("href", "/ai");
    expect(html).toContain("大模型与AIGC");
  });

  it("moves next and previous through all five states and wraps both ways", () => {
    render(<HomeHeroCarousel slides={slides} />);
    fireEvent.click(screen.getByRole("button", {name: "上一项"}));
    expect(heading()).toHaveTextContent("绿电与清洁能源");
    fireEvent.click(screen.getByRole("button", {name: "下一项"}));
    expect(heading()).toHaveTextContent("大模型与AIGC");
    for (let index = 0; index < 5; index += 1) fireEvent.click(screen.getByRole("button", {name: "下一项"}));
    expect(heading()).toHaveTextContent("大模型与AIGC");
  });

  it("selects a state with a dot and exposes its current state", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const dots = within(screen.getByRole("navigation", {name: "业务领域进度"})).getAllByRole("button");
    expect(dots).toHaveLength(5);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    fireEvent.click(dots[2]);
    expect(heading()).toHaveTextContent("信创与企业数字化");
    expect(dots[2]).toHaveAttribute("aria-current", "true");
    expect(dots[0]).not.toHaveAttribute("aria-current");
  });

  it("changes state with ArrowLeft and ArrowRight on the region", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const region = screen.getByRole("region", {name: "光波互联业务轮播"});
    fireEvent.keyDown(region, {key: "ArrowRight"});
    expect(heading()).toHaveTextContent("IDC与算力");
    fireEvent.keyDown(region, {key: "ArrowLeft"});
    expect(heading()).toHaveTextContent("大模型与AIGC");
  });

  it("autoplays at 6000ms and resets its timeout after manual navigation", () => {
    render(<HomeHeroCarousel slides={slides} />);
    advance(5999);
    expect(heading()).toHaveTextContent("大模型与AIGC");
    fireEvent.click(screen.getByRole("button", {name: "下一项"}));
    advance(5999);
    expect(heading()).toHaveTextContent("IDC与算力");
    advance(1);
    expect(heading()).toHaveTextContent("信创与企业数字化");
  });

  it("pauses while hovered and resumes with a fresh timeout", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const region = screen.getByRole("region", {name: "光波互联业务轮播"});
    advance(3000);
    fireEvent.mouseEnter(region);
    advance(9000);
    expect(heading()).toHaveTextContent("大模型与AIGC");
    fireEvent.mouseLeave(region);
    advance(6000);
    expect(heading()).toHaveTextContent("IDC与算力");
  });

  it("pauses while focus is inside and resumes when focus leaves", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const link = screen.getByRole("link", {name: /探索大模型/});
    fireEvent.focus(link);
    advance(9000);
    expect(heading()).toHaveTextContent("大模型与AIGC");
    fireEvent.blur(link);
    advance(6000);
    expect(heading()).toHaveTextContent("IDC与算力");
  });

  it("resumes autoplay when switching removes the focused CTA", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const link = screen.getByRole("link", {name: /探索大模型/});
    link.focus();
    expect(document.activeElement).toBe(link);
    fireEvent.keyDown(link, {key: "ArrowRight"});
    expect(heading()).toHaveTextContent("IDC与算力");
    expect(document.activeElement).toBe(document.body);
    advance(6000);
    expect(heading()).toHaveTextContent("信创与企业数字化");
  });

  it("politely announces only user-selected slides", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const region = screen.getByRole("region", {name: "光波互联业务轮播"});
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole("button", {name: "下一项"}));
    expect(status).toHaveTextContent("IDC与算力");
    fireEvent.click(screen.getByRole("button", {name: "转到 XINCHUANG 业务"}));
    expect(status).toHaveTextContent("信创与企业数字化");
    fireEvent.keyDown(region, {key: "ArrowRight"});
    expect(status).toHaveTextContent("专线网络");
    fireEvent.pointerDown(region, {clientX: 260, clientY: 160, pointerId: 1});
    fireEvent.pointerUp(region, {clientX: 180, clientY: 160, pointerId: 1});
    expect(status).toHaveTextContent("绿电与清洁能源");

    advance(6000);
    expect(heading()).toHaveTextContent("大模型与AIGC");
    expect(status).toHaveTextContent("绿电与清洁能源");
  });

  it("mounts a fresh slide with an entry animation disabled for reduced motion", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const initialSlide = screen.getByTestId("home-hero-slide");
    expect(initialSlide.className).toMatch(/slide/);
    fireEvent.click(screen.getByRole("button", {name: "下一项"}));
    expect(screen.getByTestId("home-hero-slide")).not.toBe(initialSlide);

    const css = readFileSync(join(process.cwd(), "src/components/marketing/home-hero-carousel.module.css"), "utf8");
    expect(css).toMatch(/\.slide\s*\{[^}]*animation:\s*slide-enter\s+450ms/);
    expect(css).toMatch(/@keyframes slide-enter\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?translateY\(1\.5rem\)/);
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.slide\s*\{\s*animation:\s*none;/);
  });

  it("pauses when the document is hidden and resumes when visible", () => {
    render(<HomeHeroCarousel slides={slides} />);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    advance(9000);
    expect(heading()).toHaveTextContent("大模型与AIGC");
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange"));
    advance(6000);
    expect(heading()).toHaveTextContent("IDC与算力");
  });

  it("pauses for reduced motion, including a live preference change", () => {
    render(<HomeHeroCarousel slides={slides} />);
    motionMatches = true;
    act(() => motionListener?.({matches: true} as MediaQueryListEvent));
    advance(9000);
    expect(heading()).toHaveTextContent("大模型与AIGC");
    motionMatches = false;
    act(() => motionListener?.({matches: false} as MediaQueryListEvent));
    advance(6000);
    expect(heading()).toHaveTextContent("IDC与算力");
  });

  it("does not autoplay when reduced motion is already preferred on mount", () => {
    motionMatches = true;
    render(<HomeHeroCarousel slides={slides} />);
    advance(12000);
    expect(heading()).toHaveTextContent("大模型与AIGC");
  });

  it("cleans up its timer on unmount", () => {
    const setTimeoutSpy = vi.spyOn(window, "setTimeout");
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const view = render(<HomeHeroCarousel slides={slides} />);
    const timerIndex = setTimeoutSpy.mock.calls.findIndex((call) => call[1] === 6000);
    expect(timerIndex).toBeGreaterThanOrEqual(0);
    const timer = setTimeoutSpy.mock.results[timerIndex].value;
    view.unmount();
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timer);
  });

  it("switches on a 48px horizontal swipe without cancelling the pointer event", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const region = screen.getByRole("region", {name: "光波互联业务轮播"});
    fireEvent.pointerDown(region, {clientX: 260, clientY: 160, pointerId: 1});
    const up = createEvent.pointerUp(region, {clientX: 180, clientY: 166, pointerId: 1});
    fireEvent(region, up);
    expect(up.defaultPrevented).toBe(false);
    expect(heading()).toHaveTextContent("IDC与算力");
  });

  it("leaves vertical and short gestures untouched", () => {
    render(<HomeHeroCarousel slides={slides} />);
    const region = screen.getByRole("region", {name: "光波互联业务轮播"});
    fireEvent.pointerDown(region, {clientX: 260, clientY: 160, pointerId: 1});
    const vertical = createEvent.pointerUp(region, {clientX: 250, clientY: 80, pointerId: 1});
    fireEvent(region, vertical);
    fireEvent.pointerDown(region, {clientX: 260, clientY: 160, pointerId: 2});
    const short = createEvent.pointerUp(region, {clientX: 213, clientY: 160, pointerId: 2});
    fireEvent(region, short);
    expect(vertical.defaultPrevented).toBe(false);
    expect(short.defaultPrevented).toBe(false);
    expect(heading()).toHaveTextContent("大模型与AIGC");
  });
});
