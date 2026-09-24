import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {act, cleanup, fireEvent, render, screen, within} from "@testing-library/react";
import postcss from "postcss";
import {afterEach, describe, expect, it, vi} from "vitest";
import {LogoLoop} from "@/components/ui/logo-loop";

const logos = [
  {src: "/logos/first.svg", alt: "First logo", title: "First", width: 120, height: 120},
  {src: "/logos/second.svg", alt: "Second logo", title: "Second", width: 120, height: 120},
] as const;
const stylesheet = postcss.parse(readFileSync(resolve(process.cwd(), "src/components/ui/logo-loop.module.css"), "utf8"));

function cssDeclaration(selector: string, property: string) {
  let value: string | undefined;
  stylesheet.walkRules(selector, (rule) => {
    rule.walkDecls(property, (declaration) => { value = declaration.value; });
  });
  return value;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("LogoLoop", () => {
  it("keeps one accessible list and exposes its motion settings", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    render(<LogoLoop logos={logos} direction="left" speed={160} hoverSpeed={80} logoHeight={120} gap={80} fadeOut scaleOnHover ariaLabel="Providers" />);

    const region = screen.getByRole("region", {name: "Providers"});
    expect(region).toHaveAttribute("data-direction", "left");
    expect(region).toHaveAttribute("data-speed", "160");
    expect(region).toHaveAttribute("data-hover-speed", "80");
    expect(region.style.getPropertyValue("--logoloop-logo-height")).toBe("120px");
    expect(region.style.getPropertyValue("--logoloop-gap")).toBe("80px");
    expect(within(region).getAllByRole("list")).toHaveLength(1);
    expect(within(region).getAllByRole("listitem")).toHaveLength(2);
    expect(region.querySelectorAll('[aria-hidden="true"] ul')).toHaveLength(1);
  });

  it("does not schedule animation frames for reduced motion", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    const requestAnimationFrame = vi.fn(() => 1);
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);

    render(<LogoLoop logos={logos} ariaLabel="Providers" />);

    expect(screen.getByRole("region", {name: "Providers"})).toHaveAttribute("data-motion-state", "reduced");
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it.each(["up", "down"] as const)("offers a bounded vertical scrolling viewport for %s in reduced motion", (direction) => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    render(<LogoLoop logos={logos} direction={direction} logoHeight={120} gap={80} ariaLabel="Providers" />);

    const region = screen.getByRole("region", {name: "Providers"});
    const track = region.firstElementChild as HTMLElement;
    expect(region).toHaveAttribute("data-direction", direction);
    expect(region).toHaveAttribute("data-motion-state", "reduced");
    expect(region.className).toContain("vertical");
    expect(region.className).toContain("reducedMotion");
    expect(track.className).toContain("track");
    expect(cssDeclaration(".vertical.reducedMotion .track", "overflow-y")).toBe("auto");
    expect(cssDeclaration(".vertical.reducedMotion .track", "height")).toBe("100%");
    expect(cssDeclaration(".vertical.reducedMotion .track", "max-height")).toBe("100%");
  });

  it("keeps the horizontal reduced-motion track scrollable", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    render(<LogoLoop logos={logos} direction="left" ariaLabel="Providers" />);
    const region = screen.getByRole("region", {name: "Providers"});
    const track = region.firstElementChild as HTMLElement;
    expect(region).toHaveAttribute("data-motion-state", "reduced");
    expect(region.className).toContain("horizontal");
    expect(track.className).toContain("track");
    expect(cssDeclaration(".reducedMotion .track", "overflow-x")).toBe("auto");
  });

  it("cancels the animation frame and disconnects the size observer on unmount", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    const disconnect = vi.fn();
    const observe = vi.fn();
    class Observer {
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal("ResizeObserver", Observer);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return {width: this.tagName === "UL" ? 400 : 200, height: 120} as DOMRect;
    });
    let frame = 0;
    const requestAnimationFrame = vi.fn(() => ++frame);
    const cancelAnimationFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);

    const view = render(<LogoLoop logos={logos} ariaLabel="Providers" />);
    expect(requestAnimationFrame).toHaveBeenCalled();
    expect(observe).toHaveBeenCalledTimes(2);

    const lastFrame = frame;
    view.unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(lastFrame);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("cancels a running frame when reduced motion turns on", () => {
    let onChange: (() => void) | undefined;
    const media = {
      matches: false,
      addEventListener: vi.fn((_event: string, callback: () => void) => { onChange = callback; }),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal("matchMedia", vi.fn(() => media));
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return {width: this.tagName === "UL" ? 400 : 200, height: 120} as DOMRect;
    });
    let frame = 0;
    const requestAnimationFrame = vi.fn(() => ++frame);
    const cancelAnimationFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);

    render(<LogoLoop logos={logos} ariaLabel="Providers" />);
    const lastFrame = frame;
    expect(lastFrame).toBeGreaterThan(0);
    media.matches = true;
    act(() => onChange?.());

    expect(screen.getByRole("region", {name: "Providers"})).toHaveAttribute("data-motion-state", "reduced");
    expect(cancelAnimationFrame).toHaveBeenCalledWith(lastFrame);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(lastFrame);
  });

  it("slows while focus stays in the loop and resumes after focus leaves", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    render(<LogoLoop logos={[
      {node: <button type="button">First</button>, title: "First"},
      {node: <button type="button">Second</button>, title: "Second"},
    ]} ariaLabel="Providers" />);
    const region = screen.getByRole("region", {name: "Providers"});
    const first = within(region).getByRole("button", {name: "First"});
    const second = within(region).getByRole("button", {name: "Second"});

    fireEvent.focus(first);
    expect(region).toHaveAttribute("data-motion-state", "slowed");
    fireEvent.blur(first, {relatedTarget: second});
    expect(region).toHaveAttribute("data-motion-state", "slowed");
    fireEvent.blur(second, {relatedTarget: document.body});
    expect(region).toHaveAttribute("data-motion-state", "running");
  });
});
