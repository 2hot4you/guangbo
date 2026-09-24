import {act, cleanup, fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useInsertionEffect} from "react";
import {afterEach, describe, expect, it, vi} from "vitest";
import {MobileNavigation} from "@/components/layout/mobile-navigation";
import {RouteTransitionFocus} from "@/components/layout/route-transition-focus";
import {DesktopNavigation} from "@/components/layout/desktop-navigation";
import {SiteHeader} from "@/components/layout/site-header";
import {SiteFooter} from "@/components/layout/site-footer";
import {LandingSection} from "@/components/marketing/landing-page-primitives";

let pathname = "/";
vi.mock("next/navigation", () => ({usePathname: () => pathname}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
  pathname = "/";
});

describe("route transitions", () => {
  it("notifies subscribers after Next-style insertion-effect history commits finish", async () => {
    pathname = "/energy";
    window.history.replaceState(null, "", "/energy#solar");
    render(<DesktopNavigation />);
    const errors = vi.spyOn(console, "error");
    function CommitHistory() {
      useInsertionEffect(() => {
        window.history.replaceState(null, "", "/energy#storage");
      }, []);
      return null;
    }
    render(<CommitHistory />);
    await waitFor(() => expect(document.querySelector('a[href="/energy#storage"]')).toHaveAttribute("aria-current", "location"));
    expect(errors).not.toHaveBeenCalled();
  });

  it("shares history wrappers across subscribers and restores them after the last unmount", () => {
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    const first = render(<DesktopNavigation />);
    const wrappedPush = window.history.pushState;
    const wrappedReplace = window.history.replaceState;
    expect(wrappedPush).not.toBe(originalPush);
    expect(wrappedReplace).not.toBe(originalReplace);
    const second = render(<MobileNavigation />);
    expect(window.history.pushState).toBe(wrappedPush);
    expect(window.history.replaceState).toBe(wrappedReplace);
    first.unmount();
    expect(window.history.pushState).toBe(wrappedPush);
    second.unmount();
    expect(window.history.pushState).toBe(originalPush);
    expect(window.history.replaceState).toBe(originalReplace);
  });

  it("waits for an exiting navigation Drawer to be removed before focusing outside it", async () => {
    pathname = "/energy";
    window.history.replaceState(null, "", "/energy#solar");
    const view = render(<><RouteTransitionFocus /><div data-navigation-drawer><button>退出中</button></div><LandingSection id="solar" title="光伏目标" /></>);
    const target = document.getElementById("solar")!;
    target.scrollIntoView = vi.fn();
    act(() => screen.getByRole("button", {name: "退出中"}).focus());
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    expect(target).not.toHaveFocus();
    expect(target.scrollIntoView).not.toHaveBeenCalled();
    view.rerender(<><RouteTransitionFocus /><LandingSection id="solar" title="光伏目标" /></>);
    document.getElementById("solar")!.scrollIntoView = vi.fn();
    await waitFor(() => expect(document.getElementById("solar")).toHaveFocus());
  });

  it.each(["pushState", "replaceState"] as const)("tracks delayed %s commits after the click frame has passed", async (method) => {
    pathname = "/energy";
    window.history.replaceState(null, "", "/energy#solar");
    const user = userEvent.setup();
    render(<><RouteTransitionFocus /><DesktopNavigation /><a href="/energy#storage" onClick={(event) => event.preventDefault()}>延迟跳转</a><LandingSection id="solar" title="光伏目标" /><LandingSection id="storage" title="储能目标" /></>);
    const solar = document.getElementById("solar")!;
    const storage = document.getElementById("storage")!;
    solar.scrollIntoView = vi.fn();
    storage.scrollIntoView = vi.fn();
    await waitFor(() => expect(solar).toHaveFocus());
    await user.click(screen.getByRole("link", {name: "延迟跳转"}));
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    act(() => window.history[method](null, "", "/energy#storage"));
    await waitFor(() => expect(storage).toHaveFocus());
    expect(document.querySelector('a[href="/energy#storage"]')).toHaveAttribute("aria-current", "location");
    expect(document.querySelector('a[href="/energy#solar"]')).not.toHaveAttribute("aria-current");
  });

  it.each(["desktop", "mobile"])("refocuses an unchanged hash after a repeated %s link activation", async (mode) => {
    pathname = "/energy";
    window.history.replaceState(null, "", "/energy#solar");
    const user = userEvent.setup();
    render(<><RouteTransitionFocus />{mode === "desktop" ? <DesktopNavigation /> : <MobileNavigation />}<LandingSection id="solar" title="光伏目标" /></>);
    const target = document.getElementById("solar")!;
    target.scrollIntoView = vi.fn();
    await waitFor(() => expect(target).toHaveFocus());
    if (mode === "mobile") await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    else act(() => screen.getByRole("link", {name: "绿电与清洁能源"}).focus());
    const link = screen.getByRole("link", {name: "分布式光伏"});
    link.addEventListener("click", (event) => event.preventDefault());
    act(() => link.focus());
    if (mode === "desktop") await user.keyboard("{Enter}");
    else await user.click(link);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(target).toHaveFocus());
    expect(target.scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("closes an open Drawer on same-page history navigation before focusing its target", async () => {
    pathname = "/energy";
    window.history.replaceState(null, "", "/energy#storage");
    const user = userEvent.setup();
    render(<><RouteTransitionFocus /><MobileNavigation /><LandingSection id="solar" title="光伏目标" /><LandingSection id="storage" title="储能目标" /></>);
    const solar = document.getElementById("solar")!;
    const storage = document.getElementById("storage")!;
    solar.scrollIntoView = vi.fn();
    storage.scrollIntoView = vi.fn();
    await waitFor(() => expect(storage).toHaveFocus());
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    act(() => {
      window.history.replaceState(null, "", "/energy#solar");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(solar).toHaveFocus());
  });

  it("focuses a same-route Link hash when history changes without hashchange", async () => {
    pathname = "/energy";
    window.history.replaceState(null, "", "/energy");
    const user = userEvent.setup();
    render(<><RouteTransitionFocus /><a href="/energy#solar" onClick={(event) => {
      event.preventDefault();
      window.history.pushState(null, "", "/energy#solar");
    }}>前往光伏</a><LandingSection id="solar" title="分布式光伏" /></>);
    const solar = document.getElementById("solar")!;
    solar.scrollIntoView = vi.fn();
    await user.click(screen.getByRole("link", {name: "前往光伏"}));
    await waitFor(() => expect(solar).toHaveFocus());
  });

  it("focuses a cross-route hash section without resetting to the page top", async () => {
    const scrollTo = vi.fn();
    const scrollIntoView = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const view = render(<RouteTransitionFocus />);
    window.history.pushState(null, "", "/energy#solar");
    pathname = "/energy";
    view.rerender(<><RouteTransitionFocus /><LandingSection id="solar" title="分布式光伏" /></>);
    const target = document.getElementById("solar")!;
    target.scrollIntoView = scrollIntoView;
    await waitFor(() => expect(target).toHaveFocus());
    expect(scrollIntoView).toHaveBeenCalledWith({block: "start", behavior: "auto"});
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("waits for a delayed hash target and responds to same-route hash changes", async () => {
    vi.stubGlobal("scrollTo", vi.fn());
    window.history.replaceState(null, "", "/energy#solar");
    pathname = "/energy";
    const view = render(<RouteTransitionFocus />);
    view.rerender(<><RouteTransitionFocus /><LandingSection id="solar" title="分布式光伏" /><LandingSection id="storage" title="储能" /></>);
    const solar = document.getElementById("solar")!;
    solar.scrollIntoView = vi.fn();
    const storage = document.getElementById("storage")!;
    storage.scrollIntoView = vi.fn();
    await waitFor(() => expect(solar).toHaveFocus());
    act(() => {
      window.history.pushState(null, "", "/energy#storage");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    await waitFor(() => expect(storage).toHaveFocus());
  });

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

  it("clears a residual scroll offset before restoring smooth scrolling", () => {
    const root = document.documentElement;
    const originalBehavior = root.style.scrollBehavior;
    const originalScrollTop = root.scrollTop;
    root.style.scrollBehavior = "smooth";
    const frames: FrameRequestCallback[] = [];
    const scrollTo = vi.fn(({top}: ScrollToOptions) => { root.scrollTop = top ?? 0; });
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("scrollTo", scrollTo);
    const view = render(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);

    try {
      pathname = "/idc";
      view.rerender(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);
      expect(root.scrollTop).toBe(0);
      expect(root.style.scrollBehavior).toBe("auto");

      root.scrollTop = 8;
      frames[0](0);
      expect(root.scrollTop).toBe(0);
      expect(root.style.scrollBehavior).toBe("smooth");
      expect(scrollTo).toHaveBeenCalledTimes(2);
    } finally {
      view.unmount();
      root.style.scrollBehavior = originalBehavior;
      root.scrollTop = originalScrollTop;
    }
  });
});

describe("mobile navigation", () => {
  it("renders five industry disclosures with grouped hash links and only one current section", async () => {
    window.history.replaceState(null, "", "/madeinchina#local-ai");
    const errors = vi.spyOn(console, "error");
    const user = userEvent.setup();
    render(<MobileNavigation currentPath="/madeinchina" />);
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    const navigation = screen.getByRole("navigation", {name: "移动导航"});
    expect(within(navigation).getAllByRole("button", {name: /子菜单/})).toHaveLength(5);
    expect(within(navigation).getByRole("heading", {name: "产品与服务"})).toBeInTheDocument();
    expect(within(navigation).getByRole("heading", {name: "解决方案"})).toBeInTheDocument();
    const current = within(navigation).getByRole("link", {name: "本地 AI 部署"});
    expect(current).toHaveAttribute("href", "/madeinchina#local-ai");
    expect(current).toHaveAttribute("aria-current", "location");
    expect(navigation.querySelectorAll('a[href*="#"][aria-current]')).toHaveLength(1);
    expect(errors).not.toHaveBeenCalled();
  });

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
  it("keeps a focused child available when the mouse leaves the group", () => {
    vi.useFakeTimers();
    render(<DesktopNavigation />);
    const group = screen.getByRole("link", {name: "IDC与算力"}).closest("li")!;
    fireEvent.pointerEnter(group, {pointerType: "mouse"});
    const child = document.querySelector<HTMLAnchorElement>('a[href="/idc/vps"]')!;
    act(() => child.focus());
    fireEvent.pointerLeave(group, {pointerType: "mouse"});
    act(() => vi.advanceTimersByTime(180));
    expect(screen.getByRole("button", {name: "收起IDC与算力子菜单"})).toHaveAttribute("aria-expanded", "true");
    expect(child).toHaveFocus();
    expect(document.getElementById("desktop-panel-idc")).not.toHaveAttribute("inert");
  });

  it("dismisses a hovered panel with Escape even when focus is outside navigation", async () => {
    const user = userEvent.setup();
    render(<DesktopNavigation />);
    await user.hover(screen.getByRole("link", {name: "大模型与AIGC"}));
    const toggle = screen.getByRole("button", {name: "收起大模型与AIGC子菜单"});
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("shows Home as its first direct link and marks it current on the home page", () => {
    render(<DesktopNavigation currentPath="/" />);
    const navigation = screen.getByRole("navigation", {name: "主导航"});
    const firstLink = within(navigation).getAllByRole("link")[0];
    expect(firstLink).toHaveTextContent("首页");
    expect(firstLink).toHaveAttribute("href", "/");
    expect(firstLink).toHaveAttribute("aria-current", "page");
  });

  it("keeps overview links separate and every panel link mounted but unavailable while closed", () => {
    render(<DesktopNavigation currentPath="/ai/llm" />);
    expect(screen.getByRole("link", {name: "大模型与AIGC"})).toHaveAttribute("href", "/ai");
    expect(screen.getByRole("link", {name: "IDC与算力"})).toHaveAttribute("href", "/idc");
    expect(screen.getAllByRole("button", {name: /子菜单/})).toHaveLength(5);
    const panel = document.getElementById("desktop-panel-madeinchina")!;
    expect(panel).toHaveStyle({visibility: "hidden", pointerEvents: "none"});
    expect(panel).toHaveAttribute("inert");
    expect(panel.querySelector('a[href="/madeinchina#local-ai"]')).toBeInTheDocument();
    expect(screen.queryByRole("link", {name: "本地 AI 部署"})).not.toBeInTheDocument();
    expect(screen.queryByText(/总览/)).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/console"]')).toBeNull();
  });

  it("opens on hover, keeps one panel open, and cancels delayed close when entering its panel", () => {
    vi.useFakeTimers();
    render(<DesktopNavigation />);
    const ai = screen.getByRole("link", {name: "大模型与AIGC"}).closest("li")!;
    const idc = screen.getByRole("link", {name: "IDC与算力"}).closest("li")!;
    fireEvent.pointerEnter(ai, {pointerType: "mouse"});
    expect(document.getElementById("desktop-panel-ai")).toHaveStyle({visibility: "visible"});
    fireEvent.pointerLeave(ai, {pointerType: "mouse"});
    act(() => vi.advanceTimersByTime(100));
    fireEvent.pointerEnter(document.getElementById("desktop-panel-ai")!, {pointerType: "mouse"});
    act(() => vi.advanceTimersByTime(180));
    expect(document.getElementById("desktop-panel-ai")).toHaveStyle({visibility: "visible"});
    fireEvent.pointerEnter(idc, {pointerType: "mouse"});
    expect(document.getElementById("desktop-panel-ai")).toHaveStyle({visibility: "hidden"});
    expect(document.getElementById("desktop-panel-idc")).toHaveStyle({visibility: "visible"});
    fireEvent.pointerLeave(idc, {pointerType: "mouse"});
    act(() => vi.advanceTimersByTime(179));
    expect(document.getElementById("desktop-panel-idc")).toHaveStyle({visibility: "visible"});
    act(() => vi.advanceTimersByTime(1));
    expect(document.getElementById("desktop-panel-idc")).toHaveStyle({visibility: "hidden"});
  });

  it("opens on keyboard focus, tabs into links, and closes with Escape returning to its button", async () => {
    const user = userEvent.setup();
    render(<DesktopNavigation />);
    act(() => screen.getByRole("link", {name: "大模型与AIGC"}).focus());
    const toggle = screen.getByRole("button", {name: "收起大模型与AIGC子菜单"});
    await user.tab();
    expect(toggle).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", {name: "LLM与多模态理解"})).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.tab();
    expect(screen.getByRole("link", {name: "IDC与算力"})).toHaveFocus();
  });

  it("toggles once per touch tap despite compatibility mouse and focus events", () => {
    render(<DesktopNavigation />);
    const toggle = screen.getByRole("button", {name: "展开全国专线租赁子菜单"});
    function tap() {
      fireEvent.pointerEnter(toggle, {pointerType: "touch"});
      fireEvent.pointerDown(toggle, {pointerType: "touch"});
      fireEvent.pointerUp(toggle, {pointerType: "touch"});
      fireEvent.mouseOver(toggle);
      fireEvent.mouseDown(toggle);
      fireEvent.focusIn(toggle);
      fireEvent.mouseUp(toggle);
      fireEvent.click(toggle, {pointerType: "touch"});
    }
    tap();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    tap();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("supports button clicks and closes after route changes", () => {
    const view = render(<DesktopNavigation />);
    const toggle = screen.getByRole("button", {name: "展开全国专线租赁子菜单"});
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    pathname = "/network";
    view.rerender(<DesktopNavigation />);
    expect(screen.getByRole("button", {name: "展开全国专线租赁子菜单"})).toHaveAttribute("aria-expanded", "false");
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
