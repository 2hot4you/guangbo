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
    const toggle = screen.getByRole("button", {name: "展开IDC与算力子菜单"});
    await user.click(toggle);
    const current = screen.getByRole("link", {name: /GPU算力服务/});
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveTextContent("当前页面");
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

  it("closes on route changes", async () => {
    const user = userEvent.setup();
    const view = render(<MobileNavigation />);
    await user.click(screen.getByRole("button", {name: "打开导航菜单"}));
    expect(screen.getByRole("dialog", {name: "网站导航"})).toBeInTheDocument();
    pathname = "/about";
    view.rerender(<MobileNavigation />);
    await waitFor(() => expect(screen.queryByRole("dialog", {name: "网站导航"})).not.toBeInTheDocument());
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
  it("offers overview and child links inside the AI dropdown", async () => {
    const user = userEvent.setup();
    render(<DesktopNavigation currentPath="/ai/llm" />);
    await user.click(screen.getByRole("button", {name: "大模型与AIGC菜单"}));
    expect(screen.getByRole("link", {name: "大模型与AIGC总览"})).toHaveAttribute("href", "/ai");
    expect(screen.getByRole("link", {name: /LLM与多模态理解/})).toHaveAttribute("href", "/ai/llm");
    expect(screen.getByRole("link", {name: /LLM与多模态理解/})).toHaveAttribute("aria-current", "page");
    expect(document.querySelector('a[href="/console"]')).toBeNull();
  });
});
