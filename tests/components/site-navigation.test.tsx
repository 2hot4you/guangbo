import {cleanup, render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, describe, expect, it, vi} from "vitest";
import {MobileNavigation} from "@/components/layout/mobile-navigation";
import {RouteTransitionFocus} from "@/components/layout/route-transition-focus";
import {DesktopNavigation} from "@/components/layout/desktop-navigation";
import {SiteHeader} from "@/components/layout/site-header";
import {SiteFooter} from "@/components/layout/site-footer";

let pathname = "/";
vi.mock("next/navigation", () => ({usePathname: () => pathname}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  pathname = "/";
});

describe("route transitions", () => {
  it("focuses main without scrolling it and resets a changed route to the absolute top", async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const view = render(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);

    expect(scrollTo).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
    pathname = "/idc";
    view.rerender(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);

    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({left: 0, top: 0, behavior: "auto"}));
    expect(focus).toHaveBeenCalledWith({preventScroll: true});
  });

  it("restores the root scroll behavior when rapid routes and unmount cancel pending frames", () => {
    const root = document.documentElement;
    const originalBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    const cancelFrame = vi.fn((frame: number) => frames.delete(frame));
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      const frame = ++nextFrame;
      frames.set(frame, callback);
      return frame;
    }));
    vi.stubGlobal("cancelAnimationFrame", cancelFrame);
    vi.stubGlobal("scrollTo", vi.fn());
    const view = render(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);

    try {
      pathname = "/idc";
      view.rerender(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);
      expect(root.style.scrollBehavior).toBe("auto");
      expect(frames.size).toBe(1);

      pathname = "/about";
      view.rerender(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);
      expect(cancelFrame).toHaveBeenCalledWith(1);
      expect(root.style.scrollBehavior).toBe("auto");
      expect(frames.size).toBe(1);

      view.unmount();
      expect(cancelFrame).toHaveBeenCalledWith(2);
      expect(frames.size).toBe(0);
      expect(root.style.scrollBehavior).toBe("smooth");
    } finally {
      view.unmount();
      root.style.scrollBehavior = originalBehavior;
    }
  });
});

describe("mobile navigation", () => {
  it("shows Home first from the shared primary navigation and marks it current", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation currentPath="/" />);
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));

    const navigation = screen.getByRole("navigation", {name: "移动导航"});
    const firstLink = within(navigation).getAllByRole("link")[0];
    expect(firstLink).toHaveTextContent("首页");
    expect(firstLink).toHaveAttribute("href", "/");
    expect(firstLink).toHaveAttribute("aria-current", "page");
  });

  it("keeps AI overview reachable independently from submenu expansion", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation currentPath="/" />);
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    expect(screen.getByRole("link", {name: "大模型与AIGC"})).toHaveAttribute("href", "/ai");
    expect(screen.queryByText(/总览/)).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", {name: "展开大模型与AIGC子菜单"});
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", {name: "LLM与多模态理解"})).toHaveAttribute("href", "/ai/llm");
  });

  it("keeps IDC overview reachable and marks the current child page without status copy", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation currentPath="/idc/gpu" />);
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    expect(screen.getByRole("link", {name: "IDC与算力"})).toHaveAttribute("href", "/idc");
    const toggle = screen.getByRole("button", {name: "收起IDC与算力子菜单"});
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const current = screen.getByRole("link", {name: /GPU算力服务/});
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveTextContent("GPU算力服务");
    expect(current).not.toHaveTextContent("当前页面");
    await user.click(toggle);
    expect(screen.getByRole("button", {name: "展开IDC与算力子菜单"})).toHaveAttribute("aria-expanded", "false");
  });

  it("closes via its close button and has no console link", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation currentPath="/" />);
    const opener = screen.getByRole("button", {name: "打开导航菜单"});
    await user.click(opener);
    expect(screen.getByRole("dialog", {name: "网站导航"})).toBeInTheDocument();
    expect(document.querySelector('a[href="/console"]')).toBeNull();
    await user.click(screen.getByRole("button", {name: "关闭导航菜单"}));
    await waitFor(() => expect(screen.queryByRole("dialog", {name: "网站导航"})).not.toBeInTheDocument());
  });

  it("closes when a navigation link is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);
    const opener = screen.getByRole("button", {name: "打开导航菜单"});
    await user.click(opener);
    expect(screen.getByRole("dialog", {name: "网站导航"})).toBeInTheDocument();
    const destination = screen.getByRole("link", {name: "关于我们"});
    expect(destination).toHaveAttribute("href", "/about");
    destination.addEventListener("click", (event) => event.preventDefault());
    await user.click(destination);
    await waitFor(() => expect(screen.queryByRole("dialog", {name: "网站导航"})).not.toBeInTheDocument());
  });

  it("closes when the pathname changes while the drawer is open", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("scrollTo", vi.fn());
    const view = render(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /><MobileNavigation /></>);
    const main = screen.getByRole("main");
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    expect(screen.getByRole("dialog", {name: "网站导航"})).toBeInTheDocument();
    pathname = "/about";
    view.rerender(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /><MobileNavigation /></>);
    await waitFor(() => expect(screen.queryByRole("dialog", {name: "网站导航"})).not.toBeInTheDocument());
    expect(screen.getByRole("button", {name: "打开导航菜单"})).toBeInTheDocument();
    await waitFor(() => expect(main).toHaveFocus());
  });

  it("dismisses on Escape and restores focus to the menu button", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);
    const opener = screen.getByRole("button", {name: "打开导航菜单"});
    await user.click(opener);
    expect(screen.getByRole("dialog", {name: "网站导航"})).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", {name: "网站导航"})).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });
});

describe("desktop navigation", () => {
  it("shows Home as its first direct link and marks it current on the home page", () => {
    render(<DesktopNavigation currentPath="/" />);
    const navigation = screen.getByRole("navigation", {name: "主导航"});
    const firstLink = within(navigation).getAllByRole("link")[0];
    expect(firstLink).toHaveTextContent("首页");
    expect(firstLink).toHaveAttribute("href", "/");
    expect(firstLink).toHaveAttribute("aria-current", "page");
  });

  it("lays out top-level sections as direct links without overview menus", () => {
    render(<DesktopNavigation currentPath="/ai/llm" />);
    expect(screen.getByRole("link", {name: "大模型与AIGC"})).toHaveAttribute("href", "/ai");
    expect(screen.getByRole("link", {name: "IDC与算力"})).toHaveAttribute("href", "/idc");
    expect(screen.queryByRole("button", {name: /菜单/})).not.toBeInTheDocument();
    expect(screen.queryByText(/总览/)).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/console"]')).toBeNull();
  });

  it("uses aria state and styling instead of visible current-section labels", () => {
    render(<DesktopNavigation currentPath="/ai/llm" />);
    const currentSection = screen.getByRole("link", {name: "大模型与AIGC"});
    expect(currentSection).toHaveAttribute("aria-current", "location");
    expect(currentSection).not.toHaveTextContent("当前栏目");
    expect(screen.queryByText(/当前页面|当前栏目/)).not.toBeInTheDocument();
  });

  it("reserves disabled login and registration actions at the right edge", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("button", {name: "登录"})).toBeDisabled();
    expect(screen.getByRole("button", {name: "注册"})).toBeDisabled();
  });
});

describe("site footer", () => {
  it("keeps the navigation on the left and removes the repeated brand link", () => {
    render(<SiteFooter />);
    const footer = screen.getByRole("contentinfo");
    const navigation = within(footer).getByRole("navigation", {name: "页脚导航"});
    const description = within(footer).getByText("连接模型、算力、网络与能源，支持企业把技术能力落到真实业务。");

    expect(within(footer).queryByRole("link", {name: "光波互联"})).not.toBeInTheDocument();
    expect(navigation.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const wordmark = footer.querySelector(".site-footer__wordmark");
    expect(wordmark).toHaveTextContent("光波互联");
    expect(wordmark?.firstElementChild).toHaveTextContent("光波互联");
  });
});
