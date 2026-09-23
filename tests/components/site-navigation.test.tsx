import {cleanup, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, describe, expect, it, vi} from "vitest";
import {MobileNavigation} from "@/components/layout/mobile-navigation";
import {DesktopNavigation} from "@/components/layout/desktop-navigation";

let pathname = "/";
vi.mock("next/navigation", () => ({usePathname: () => pathname}));

afterEach(() => {
  cleanup();
  pathname = "/";
});

describe("mobile navigation", () => {
  it("keeps AI overview reachable independently from submenu expansion", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation currentPath="/" />);
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    expect(screen.getByRole("link", {name: "大模型与AIGC总览"})).toHaveAttribute("href", "/ai");
    const toggle = screen.getByRole("button", {name: "展开大模型与AIGC子菜单"});
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", {name: "LLM与多模态理解"})).toHaveAttribute("href", "/ai/llm");
  });

  it("keeps IDC overview reachable and marks the current child page visibly", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation currentPath="/idc/gpu" />);
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    expect(screen.getByRole("link", {name: "IDC与算力总览"})).toHaveAttribute("href", "/idc");
    const toggle = screen.getByRole("button", {name: "收起IDC与算力子菜单"});
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const current = screen.getByRole("link", {name: /GPU算力服务/});
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveTextContent("当前页面");
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

  it("closes when a navigation link is clicked and after the route changes", async () => {
    const user = userEvent.setup();
    const view = render(<MobileNavigation />);
    const opener = screen.getByRole("button", {name: "打开导航菜单"});
    await user.click(opener);
    expect(screen.getByRole("dialog", {name: "网站导航"})).toBeInTheDocument();
    const destination = screen.getByRole("link", {name: "关于我们"});
    expect(destination).toHaveAttribute("href", "/about");
    destination.addEventListener("click", (event) => event.preventDefault());
    await user.click(destination);
    await waitFor(() => expect(screen.queryByRole("dialog", {name: "网站导航"})).not.toBeInTheDocument());
    pathname = "/about";
    view.rerender(<MobileNavigation />);
    await waitFor(() => expect(screen.queryByRole("dialog", {name: "网站导航"})).not.toBeInTheDocument());
    expect(screen.getByRole("button", {name: "打开导航菜单"})).toBeInTheDocument();
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
  it("offers a keyboard-operable menu with overview and child link targets", async () => {
    const user = userEvent.setup();
    render(<DesktopNavigation currentPath="/ai/llm" />);
    const trigger = screen.getByRole("button", {name: "大模型与AIGC菜单"});
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    const overview = screen.getByRole("menuitem", {name: "大模型与AIGC总览"});
    const child = screen.getByRole("menuitem", {name: /LLM与多模态理解/});
    expect(overview).toHaveAttribute("href", "/ai");
    expect(child).toHaveAttribute("href", "/ai/llm");
    expect(child).toHaveAttribute("aria-current", "page");
    expect(overview).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(child).toHaveFocus();
    const activation = vi.fn((event: Event) => event.preventDefault());
    child.addEventListener("click", activation);
    await user.keyboard("{Enter}");
    expect(activation).toHaveBeenCalledOnce();
    expect(document.querySelector('a[href="/console"]')).toBeNull();
  });
});
