import {cleanup, fireEvent, render, screen, within} from "@testing-library/react";
import {afterEach, describe, expect, it, vi} from "vitest";
import {ModelEcosystemLoop} from "@/components/marketing/model-ecosystem-loop";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ModelEcosystemLoop", () => {
  it("renders the complete provider and model catalogs with fixed loop settings", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    render(<ModelEcosystemLoop />);

    const providers = screen.getByRole("region", {name: "AI Providers"});
    const models = screen.getByRole("region", {name: "AI Models"});
    expect(providers).toHaveAttribute("data-direction", "left");
    expect(models).toHaveAttribute("data-direction", "right");
    for (const region of [providers, models]) {
      expect(region).toHaveAttribute("data-speed", "160");
      expect(region).toHaveAttribute("data-hover-speed", "80");
      expect(region.style.getPropertyValue("--logoloop-logo-height")).toBe("120px");
      expect(region.style.getPropertyValue("--logoloop-gap")).toBe("80px");
      expect(region.className).toContain("fadeOut");
      expect(region.className).toContain("scaleOnHover");
    }
    expect(within(providers).getAllByRole("listitem")).toHaveLength(136);
    expect(within(models).getAllByRole("listitem")).toHaveLength(72);
    expect(screen.getByText("PROVIDERS / 136")).toBeInTheDocument();
    expect(screen.getByText("MODELS / 72")).toBeInTheDocument();
  });

  it("falls back from a failed color SVG to the matching mono SVG, then keeps the name", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    render(<ModelEcosystemLoop />);

    const providers = screen.getByRole("region", {name: "AI Providers"});
    const models = screen.getByRole("region", {name: "AI Models"});
    const providerItems = within(providers).getAllByRole("listitem");
    const firstProvider = providerItems[0];
    const modelItems = within(models).getAllByRole("listitem");
    const unaffectedItems = [...providerItems.slice(1), ...modelItems];
    const unaffectedImages = unaffectedItems.map((item) => item.querySelector("img"));
    const firstName = "01.AI (零一万物)";
    const firstColor = "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zeroone-color.svg";
    const firstMono = "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zeroone.svg";
    const image = firstProvider.querySelector("img");

    expect(image).toHaveAttribute("src", firstColor);
    expect(image).toHaveAttribute("alt", "");
    expect(firstProvider).toHaveTextContent(firstName);

    fireEvent.error(image!);
    expect(firstProvider.querySelector("img")).toHaveAttribute("src", firstMono);
    expect(firstProvider).toHaveTextContent(firstName);
    expect(unaffectedItems).toHaveLength(207);
    unaffectedItems.forEach((item, index) => expect(item.querySelector("img")).toBe(unaffectedImages[index]));
    expect(within(providers).getAllByRole("listitem")).toHaveLength(136);
    expect(within(models).getAllByRole("listitem")).toHaveLength(72);

    fireEvent.error(firstProvider.querySelector("img")!);
    expect(firstProvider.querySelector("img")).toBeNull();
    expect(firstProvider).toHaveTextContent(firstName);
    unaffectedItems.forEach((item, index) => expect(item.querySelector("img")).toBe(unaffectedImages[index]));
    expect(within(providers).getAllByRole("listitem")).toHaveLength(136);
    expect(within(models).getAllByRole("listitem")).toHaveLength(72);
  });
});
