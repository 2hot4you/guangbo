import {expect, test, type Locator, type Page} from "@playwright/test";

const publicPaths = [
  "/", "/ai", "/ai/llm", "/ai/image", "/ai/video",
  "/idc", "/idc/vps", "/idc/bare-metal", "/idc/colocation", "/idc/gpu",
  "/madeinchina", "/network", "/energy", "/about",
] as const;

const topLevelPaths = ["/ai", "/idc", "/madeinchina", "/network", "/energy", "/about"] as const;
const topLevelPathSet = new Set<string>(topLevelPaths);
const sampledPaths = ["/", "/ai/llm", "/idc/colocation", ...topLevelPaths] as const;
const viewportWidths = [360, 768, 1280, 1440] as const;

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return {scrollWidth: root.scrollWidth, clientWidth: root.clientWidth};
  });
  expect(overflow.scrollWidth, `horizontal overflow: ${page.url()} at ${overflow.clientWidth}px`).toBeLessThanOrEqual(overflow.clientWidth);
}

async function expectContrastingKeyboardFocus(page: Page, target: Locator) {
  await target.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(target).toBeFocused();
  const treatment = await target.evaluate((element) => {
    const context = document.createElement("canvas").getContext("2d")!;
    function rgba(color: string) {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    }
    function luminance(channels: number[]) {
      return channels.slice(0, 3).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      }).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
    }
    const ancestors = [];
    for (let current = element.parentElement; current; current = current.parentElement) ancestors.unshift(current);
    let background = [255, 255, 255];
    for (const ancestor of ancestors) {
      const color = rgba(getComputedStyle(ancestor).backgroundColor);
      background = background.map((channel, index) => color[index] * color[3] / 255 + channel * (1 - color[3] / 255));
    }
    const style = getComputedStyle(element);
    const outline = rgba(style.outlineColor);
    const paintedOutline = background.map((channel, index) => outline[index] * outline[3] / 255 + channel * (1 - outline[3] / 255));
    const first = luminance(paintedOutline);
    const second = luminance(background);
    return {
      visible: element.matches(":focus-visible"),
      width: parseFloat(style.outlineWidth),
      style: style.outlineStyle,
      color: style.outlineColor,
      contrast: (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05),
    };
  });
  expect(treatment.visible).toBe(true);
  expect(treatment.style).toBe("solid");
  expect(treatment.width).toBeGreaterThanOrEqual(2);
  expect(treatment.contrast, JSON.stringify(treatment)).toBeGreaterThanOrEqual(3);
}

for (const path of publicPaths) {
  test(`${path} responds with one visible H1 and fits the project viewport`, async ({page}) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    if (path === "/" || topLevelPathSet.has(path)) {
      await expect(page.getByRole("navigation", {name: "面包屑导航"})).toHaveCount(0);
    } else {
      const breadcrumbs = page.getByRole("navigation", {name: "面包屑导航"});
      await expect(breadcrumbs).toBeVisible();
      await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText(getRouteLabel(path));
    }
    if (topLevelPathSet.has(path)) {
      const landing = page.locator("[data-landing-page]");
      await expect(landing).toHaveCount(1);
      await expect(landing.locator("section[data-content-module]")).toHaveCount(9);
    }
    await expectNoHorizontalOverflow(page);
  });
}

function getRouteLabel(path: (typeof publicPaths)[number]) {
  const labels: Record<(typeof publicPaths)[number], string> = {
    "/": "首页",
    "/ai": "大模型与AIGC",
    "/ai/llm": "LLM与多模态理解",
    "/ai/image": "图像生成与编辑",
    "/ai/video": "视频生成与编辑",
    "/idc": "IDC与算力",
    "/idc/vps": "全国VPS租赁",
    "/idc/bare-metal": "全国裸金属服务器租赁",
    "/idc/colocation": "全国机房机柜租赁",
    "/idc/gpu": "GPU算力服务",
    "/madeinchina": "信创与企业数字化",
    "/network": "全国专线租赁",
    "/energy": "绿电与清洁能源",
    "/about": "关于我们",
  };
  return labels[path];
}

test("sample pages fit all required CSS viewport widths", async ({page}) => {
  test.setTimeout(60_000);
  for (const width of viewportWidths) {
    await page.setViewportSize({width, height: 900});
    for (const path of sampledPaths) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} at ${width}px`).toBe(200);
      await expectNoHorizontalOverflow(page);
      await expect(page.locator("footer")).toBeVisible();
      const undersizedFooterLinks = await page.locator("footer a").evaluateAll((links) => links.flatMap((link) => {
        const rect = link.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44 ? [`${link.textContent}: ${rect.width}×${rect.height}`] : [];
      }));
      expect(undersizedFooterLinks, `footer touch targets at ${path}, ${width}px`).toEqual([]);
      if (width >= 1280) {
        await expect(page.getByRole("navigation", {name: "主导航"})).toBeVisible();
        await expect(page.getByRole("button", {name: "打开导航菜单"})).toBeHidden();
      } else {
        await expect(page.getByRole("navigation", {name: "主导航"})).toBeHidden();
        await expect(page.getByRole("button", {name: "打开导航菜单"})).toBeVisible();
      }
      await expect(page.locator("header img")).toBeVisible();
      const logoLoaded = await page.locator("header img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0);
      expect(logoLoaded, `logo failed to load at ${path}, ${width}px`).toBe(true);
      const clipped = await page.locator(".marketing-card, footer, .network-landing-topology").evaluateAll((elements) => elements.flatMap((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > window.innerWidth + 1 || element.scrollWidth > element.clientWidth + 1
          ? [`${element.className || element.tagName}: ${rect.left}..${rect.right}, ${element.scrollWidth}/${element.clientWidth}`]
          : [];
      }));
      expect(clipped, `cards, footer, or topology overflow at ${path}, ${width}px`).toEqual([]);
      if (path === "/network") {
        const topology = page.locator(".network-landing-topology");
        await expect(topology).toBeVisible();
        const bounds = await topology.boundingBox();
        expect(bounds, `network topology has no bounds at ${width}px`).not.toBeNull();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      }
    }
  }
});

test("mobile AI and IDC navigation exposes overview and children and closes after navigation", async ({page}) => {
  await page.setViewportSize({width: 360, height: 800});
  await page.goto("/");
  const opener = page.getByRole("button", {name: "打开导航菜单"});
  await opener.click();
  const drawer = page.getByRole("dialog", {name: "网站导航"});
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", {name: "大模型与AIGC", exact: true})).toHaveAttribute("href", "/ai");
  await expect(drawer.getByRole("link", {name: "IDC与算力", exact: true})).toHaveAttribute("href", "/idc");
  await drawer.getByRole("button", {name: "展开大模型与AIGC子菜单"}).click();
  await expect(drawer.getByRole("link", {name: "LLM与多模态理解"})).toBeVisible();
  await drawer.getByRole("button", {name: "展开IDC与算力子菜单"}).click();
  await expect(drawer.getByRole("link", {name: "全国机房机柜租赁"})).toBeVisible();
  await drawer.getByRole("link", {name: "全国机房机柜租赁"}).click();
  await expect(page).toHaveURL(/\/idc\/colocation$/);
  await expect(drawer).not.toBeVisible();
  await expect(page.locator("#main-content")).toBeFocused();
});

test("desktop navigation uses direct links with Home first and visible keyboard focus", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/");
  const nav = page.getByRole("navigation", {name: "主导航"});
  await expect(nav).toBeVisible();
  expect(await nav.getByRole("link").evaluateAll((links) => links.map((link) => ({
    label: link.textContent?.trim(), href: link.getAttribute("href"),
  })))).toEqual([
    {label: "首页", href: "/"},
    {label: "大模型与AIGC", href: "/ai"},
    {label: "IDC与算力", href: "/idc"},
    {label: "信创与企业数字化", href: "/madeinchina"},
    {label: "全国专线租赁", href: "/network"},
    {label: "绿电与清洁能源", href: "/energy"},
    {label: "关于我们", href: "/about"},
  ]);
  await expect(nav.getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("menu")).toHaveCount(0);
  const aiLink = nav.getByRole("link", {name: "大模型与AIGC"});
  for (let attempt = 0; attempt < 12 && !(await aiLink.evaluate((element) => element === document.activeElement)); attempt++) {
    await page.keyboard.press("Tab");
  }
  await expect(aiLink).toBeFocused();
  expect(await aiLink.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/ai$/);
});

test("dark footer links and home energy link have contrasting keyboard outlines", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/");
  await expectContrastingKeyboardFocus(page, page.locator(".home-domain--energy a"));
  for (const path of topLevelPaths) {
    await page.goto(path);
    for (const link of await page.locator("footer a").all()) await expectContrastingKeyboardFocus(page, link);
  }
});

test("every dark landing surface supplies a contrasting focus treatment", async ({page}) => {
  for (const path of topLevelPaths) {
    await page.goto(path);
    const darkSections = page.locator('[data-content-module][class*="toneDark"]');
    await expect(darkSections.first()).toHaveCSS("background-color", "rgb(8, 8, 8)");
    expect(await darkSections.count()).toBeGreaterThan(0);
    for (const section of await darkSections.all()) {
      // Content-only surfaces have no links today. Temporarily focus their real heading
      // to exercise the inherited token with the shared [tabindex] focus rule.
      const heading = section.locator("h1, h2").first();
      await heading.evaluate((element) => element.setAttribute("tabindex", "0"));
      await expectContrastingKeyboardFocus(page, heading);
      await heading.evaluate((element) => element.removeAttribute("tabindex"));
    }
  }
});

test("AI stays visual-right while IDC places its infrastructure graphic on the left", async ({page}) => {
  for (const width of [360, 1280, 1440]) {
    await page.setViewportSize({width, height: 900});
    for (const path of ["/ai", "/idc"]) {
      await page.goto(path);
      const title = await page.locator("h1").boundingBox();
      const visual = await page.locator("#hero figure").boundingBox();
      expect(title).not.toBeNull();
      expect(visual).not.toBeNull();
      if (width >= 1280) {
        if (path === "/idc") {
          expect(visual!.x + visual!.width, `${path} visual left of title at ${width}px`).toBeLessThanOrEqual(title!.x);
        } else {
          expect(visual!.x, `${path} visual right of title at ${width}px`).toBeGreaterThan(title!.x + title!.width);
        }
        expect(visual!.y).toBeLessThan(title!.y + title!.height);
        expect(visual!.y + visual!.height).toBeLessThanOrEqual(900);
      } else {
        expect(visual!.y).toBeGreaterThan(title!.y + title!.height);
      }
    }
  }
});

test("landing hero graphics animate unless reduced motion is requested", async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  for (const {path, hero} of [
    {path: "/ai", hero: "hero"},
    {path: "/idc", hero: "hero"},
    {path: "/madeinchina", hero: "madeInChina-hero"},
    {path: "/network", hero: "network-hero"},
    {path: "/energy", hero: "energy-hero"},
  ]) {
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.goto(path);
    const motionLayers = page.locator(`#${hero} [data-motion-layer]`);
    expect(await motionLayers.count()).toBeGreaterThanOrEqual(3);
    const runningAnimations = await motionLayers.evaluateAll((elements) => elements.filter((element) => {
      const style = getComputedStyle(element);
      return style.animationName !== "none" && style.animationPlayState === "running";
    }).length);
    expect(runningAnimations).toBeGreaterThanOrEqual(3);

    await page.emulateMedia({reducedMotion: "reduce"});
    await page.reload();
    const reducedAnimations = await motionLayers.evaluateAll((elements) => elements.filter((element) => getComputedStyle(element).animationName !== "none").length);
    expect(reducedAnimations).toBe(0);
  }
});

test("energy mobile hero keeps its overview and business circle visual compact", async ({page}) => {
  await page.setViewportSize({width: 360, height: 900});
  await page.goto("/energy");
  const hero = await page.locator("#energy-hero").boundingBox();
  const artwork = page.getByRole("figure", {name: "ENERGY业务动态图形"});
  await expect(artwork).toBeVisible();
  const figure = await artwork.boundingBox();
  expect(hero!.height).toBeLessThanOrEqual(1000);
  expect(figure!.y + figure!.height).toBeLessThanOrEqual(900);
  await expect(page.getByRole("figure", {name: "清洁能源项目视觉占位"})).toHaveCount(0);
  await expect(page.getByText("项目图片尚待确认", {exact: true})).toHaveCount(0);
});

test("AI and IDC content links offer 44px targets with working padded hit areas", async ({page}) => {
  await page.setViewportSize({width: 360, height: 900});
  for (const path of ["/ai", "/idc"]) {
    await page.goto(path);
    const links = await page.locator("[data-landing-page] a").evaluateAll((elements) => elements.map((element) => ({
      href: element.getAttribute("href")!,
      label: element.textContent!,
      height: element.getBoundingClientRect().height,
    })));
    expect(links.length).toBeGreaterThanOrEqual(4);
    for (const link of links) {
      expect(link.height, `${path}: ${link.label}`).toBeGreaterThanOrEqual(44);
      const target = page.locator(`[data-landing-page] a[href="${link.href}"]`).filter({hasText: link.label}).first();
      await target.click({position: {x: 4, y: 3}});
      await expect(page).toHaveURL(new RegExp(`${link.href}$`));
      await page.goto(path);
    }
  }
});

test("small landing labels retain at least 65 percent effective text opacity", async ({page}) => {
  for (const path of topLevelPaths) {
    await page.goto(path);
    const fadedLabels = await page.locator("[data-landing-page] *").evaluateAll((elements) => {
      const context = document.createElement("canvas").getContext("2d")!;
      return elements.flatMap((element) => {
        const style = getComputedStyle(element);
        if (element.children.length || !element.textContent?.trim() || parseFloat(style.fontSize) > 13) return [];
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = style.color;
        context.fillRect(0, 0, 1, 1);
        let opacity = context.getImageData(0, 0, 1, 1).data[3] / 255;
        for (let current: Element | null = element; current; current = current.parentElement) opacity *= Number(getComputedStyle(current).opacity);
        return opacity < 0.645 ? [`${element.textContent}: ${opacity}`] : [];
      });
    });
    expect(fadedLabels, path).toEqual([]);
  }
});

test("unknown route responds 404 with the intended H1", async ({page}) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", {level: 1, name: "页面未找到"})).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  await expect(page).not.toHaveTitle("光波互联｜大模型、算力与企业数字化服务");
});

test("sitemap lists exactly the fourteen public paths", async ({request}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  expect(urls).toHaveLength(14);
  expect(urls.sort()).toEqual([...publicPaths].sort());
});

test("unconfigured origin allows crawling but omits sitemap and marks pages noindex", async ({request}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toMatch(/User-agent:\s*\*/i);
  expect(text).toMatch(/Allow:\s*\//i);
  expect(text).not.toMatch(/Sitemap:/i);
  for (const path of ["/", "/ai/llm", "/idc/colocation", "/network", "/energy", "/about"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(await response.text()).toMatch(/<meta[^>]+name="robots"[^>]+content="noindex, nofollow"/i);
  }
});

test("initial HTML contains public headings and leads without client hydration", async ({request}) => {
  const cases = [
    ["/", "让大模型走进应用，让创意成为内容", "从LLM语言理解"],
    ["/network", "连接分支、机房与云端业务", "面向企业多地办公"],
    ["/about", "以光为媒，连接世界；以算为基，赋能未来", "成都光波互联科技有限公司成立于2019年"],
  ] as const;
  for (const [path, heading, lead] of cases) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<h1`);
    expect(html).toContain(heading);
    expect(html).toContain(lead);
  }
});

test("public pages expose no console, auth, payment, fake pricing, or online generation actions", async ({page}) => {
  for (const path of publicPaths) {
    await page.goto(path);
    const actions = await page.locator("a[href], button, form[action]").evaluateAll((elements) => elements.map((element) => ({
      label: element.textContent?.trim() ?? "",
      destination: element.getAttribute("href") ?? element.getAttribute("action") ?? "",
    })));
    expect(actions, `forbidden action at ${path}`).not.toEqual(expect.arrayContaining([
      expect.objectContaining({destination: expect.stringMatching(/\/(?:console|login|register|payment|checkout)(?:[/?#]|$)/i)}),
    ]));
    expect(actions.some(({label, destination}) => /在线(?:生图|生成|视频生成)|立即支付|立即充值|查看(?:可用模型与)?价格/i.test(label) || /\/(?:generate|pricing|billing)(?:[/?#]|$)/i.test(destination)), `forbidden action at ${path}`).toBe(false);
  }
});

type HomeHeroDomain = "ai" | "compute" | "xinchang" | "link" | "energy";
const homeHeroStates: Record<HomeHeroDomain, {title: string; href: string; cta: string; dot: string}> = {
  ai: {title: "让大模型走进应用，让创意成为内容", href: "/ai", cta: "探索大模型", dot: "AI"},
  compute: {title: "IDC与算力", href: "/idc", cta: "查看IDC与算力", dot: "COMPUTE"},
  xinchang: {title: "信创与企业数字化", href: "/madeinchina", cta: "了解信创与数字化", dot: "XINCHUANG"},
  link: {title: "专线网络", href: "/network", cta: "查看专线网络", dot: "LINK"},
  energy: {title: "绿电与清洁能源", href: "/energy", cta: "了解清洁能源", dot: "ENERGY"},
};
const preservedHomeSections = ["ai", "idc", "madeinchina", "network", "energy", "delivery", "about"] as const;

async function expectActiveHomeHero(page: Page, domain: HomeHeroDomain) {
  const carousel = page.getByRole("region", {name: "光波互联业务轮播"});
  const state = homeHeroStates[domain];
  await expect(carousel).toHaveAttribute("data-domain", domain);
  await expect(carousel.getByTestId("home-hero-slide")).toHaveCount(1);
  await expect(carousel.getByRole("heading", {level: 1, name: state.title})).toBeVisible();
  await expect(carousel.getByRole("link", {name: state.cta})).toHaveAttribute("href", state.href);
  const dots = carousel.getByRole("navigation", {name: "业务领域进度"});
  await expect(dots.locator('[aria-current="true"]')).toHaveCount(1);
  await expect(dots.getByRole("button", {name: `转到 ${state.dot} 业务`})).toHaveAttribute("aria-current", "true");
}

test("desktop and mobile route changes land at the absolute page top", async ({page}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/ai");
    await page.evaluate(() => { document.scrollingElement!.scrollTop = 1400; });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    if (width < 1280) {
      await page.getByRole("button", {name: "打开导航菜单"}).click();
      await page.getByRole("navigation", {name: "移动导航"})
        .getByRole("link", {name: "IDC与算力", exact: true}).click();
    } else {
      await page.getByRole("navigation", {name: "主导航"})
        .getByRole("link", {name: "IDC与算力", exact: true}).click();
    }
    await expect(page).toHaveURL(/\/idc$/);
    await expect.poll(() => page.evaluate(() => window.scrollY), {message: `route top at ${width}px`}).toBe(0);
    await expect(page.locator("#main-content")).toBeFocused();
  }
});

test("home carousel controls and keyboard navigate all five states", async ({page}) => {
  await page.goto("/");
  const carousel = page.getByRole("region", {name: "光波互联业务轮播"});
  await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
  await expectActiveHomeHero(page, "ai");
  const dots = carousel.getByRole("navigation", {name: "业务领域进度"}).getByRole("button");
  await expect(dots).toHaveCount(5);
  for (const [index, label] of ["AI", "COMPUTE", "XINCHUANG", "LINK", "ENERGY"].entries()) {
    await expect(dots.nth(index)).toHaveAttribute("aria-label", `转到 ${label} 业务`);
  }
  await carousel.getByRole("button", {name: "下一项"}).click();
  await expectActiveHomeHero(page, "compute");
  await carousel.getByRole("button", {name: "上一项"}).click();
  await expectActiveHomeHero(page, "ai");
  for (const [index, domain] of [[2, "xinchang"], [3, "link"], [4, "energy"]] as const) {
    await dots.nth(index).click();
    await expectActiveHomeHero(page, domain);
  }
  await carousel.focus();
  await page.keyboard.press("ArrowLeft");
  await expectActiveHomeHero(page, "link");
  await page.keyboard.press("ArrowRight");
  await expectActiveHomeHero(page, "energy");
});

test("home carousel preserves CTA identity and continuous focus across consecutive arrow presses", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/");
  await page.mouse.move(0, 0);
  await expectActiveHomeHero(page, "ai");
  const carousel = page.getByRole("region", {name: "光波互联业务轮播"});
  const slide = carousel.getByTestId("home-hero-slide");
  const cta = carousel.getByRole("link");
  const originalCTA = await cta.elementHandle();
  const originalSlide = await slide.elementHandle();
  await cta.evaluate((element) => {
    element.dataset.blurCount = "0";
    element.addEventListener("blur", () => { element.dataset.blurCount = String(Number(element.dataset.blurCount) + 1); });
  });
  await cta.focus();
  let previousAnimation = await slide.evaluate((element) => getComputedStyle(element).animationName);
  expect(previousAnimation).not.toBe("none");
  for (const domain of ["compute", "xinchang"] as const) {
    await page.keyboard.press("ArrowRight");
    await expectActiveHomeHero(page, domain);
    await expect(cta).toBeFocused();
    expect(await originalCTA!.evaluate((element) => element.isConnected && element === document.activeElement)).toBe(true);
    expect(await originalSlide!.evaluate((element) => element.isConnected)).toBe(true);
    await expect(cta).toHaveAttribute("data-blur-count", "0");
    const animation = await slide.evaluate((element) => ({
      name: getComputedStyle(element).animationName,
      duration: getComputedStyle(element).animationDuration,
    }));
    expect(animation.name).not.toBe(previousAnimation);
    expect(animation.duration).toBe("0.45s");
    previousAnimation = animation.name;
    await page.waitForTimeout(6500);
    await expectActiveHomeHero(page, domain);
    await expect(cta).toBeFocused();
  }
});

test("home carousel autoplay advances and pauses for hover, focus and reduced motion", async ({page}) => {
  test.setTimeout(60_000);
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/");
  await expectActiveHomeHero(page, "ai");
  await page.waitForTimeout(6500);
  await expectActiveHomeHero(page, "compute");

  await page.goto("/");
  const carousel = page.getByRole("region", {name: "光波互联业务轮播"});
  await carousel.hover();
  await page.waitForTimeout(6500);
  await expectActiveHomeHero(page, "ai");

  await page.goto("/");
  await carousel.focus();
  await page.waitForTimeout(6500);
  await expectActiveHomeHero(page, "ai");

  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/");
  await page.waitForTimeout(6500);
  await expectActiveHomeHero(page, "ai");
  expect(await carousel.locator("[data-motion-layer]").evaluateAll((layers) =>
    layers.every((layer) => getComputedStyle(layer).animationName === "none"),
  )).toBe(true);
  await expect(carousel.getByTestId("home-hero-slide")).toHaveCSS("animation-name", "none");
  await carousel.getByRole("button", {name: "下一项"}).click();
  await expectActiveHomeHero(page, "compute");
  await expect(carousel.getByTestId("home-hero-slide")).toHaveCSS("animation-name", "none");
});

test("home carousel accepts a real horizontal touch swipe and preserves vertical touch scrolling", async ({page, context}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/");
  const carousel = page.getByRole("region", {name: "光波互联业务轮播"});
  await expectActiveHomeHero(page, "ai");
  const box = await carousel.boundingBox();
  expect(box).not.toBeNull();
  const session = await context.newCDPSession(page);
  async function touchSwipe(startX: number, startY: number, endX: number, endY: number) {
    await session.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x: startX, y: startY}]});
    for (let step = 1; step <= 8; step += 1) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{x: startX + (endX - startX) * step / 8, y: startY + (endY - startY) * step / 8}],
      });
      await page.waitForTimeout(16);
    }
    await session.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
  }
  try {
    await session.send("Emulation.setTouchEmulationEnabled", {enabled: true, maxTouchPoints: 1});
    const startX = box!.x + box!.width * 0.7;
    await touchSwipe(startX, box!.y + 120, startX - 100, box!.y + 120);
    await expectActiveHomeHero(page, "compute");
    const before = await page.evaluate(() => window.scrollY);
    await touchSwipe(startX, box!.y + 360, startX, box!.y + 160);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
    await expectActiveHomeHero(page, "compute");
  } finally {
    await session.detach();
  }
});

test("home carousel AI nodes remain circular at 390 by 600", async ({page}) => {
  await page.setViewportSize({width: 390, height: 600});
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/");
  await expectActiveHomeHero(page, "ai");
  const nodes = page.getByRole("figure", {name: "AI业务动态图形"}).locator("[data-visual-node]");
  await expect(nodes).toHaveCount(3);
  for (const node of await nodes.all()) {
    const dimensions = await node.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {width: rect.width, height: rect.height};
    });
    expect(Math.abs(dimensions.width - dimensions.height), JSON.stringify(dimensions)).toBeLessThanOrEqual(1);
    await expect(node).toHaveCSS("border-radius", "50%");
  }
});

test("home carousel keeps infrastructure banners neutral and English visual nodes contained", async ({page}) => {
  const visualNodes = {
    COMPUTE: ["COMPUTE", "STORAGE", "NETWORK", "POWER", "COOLING"],
    XINCHUANG: ["HARDWARE", "SYSTEM", "APP", "DATA"],
    LINK: ["SITE", "ACCESS", "TRANSIT", "TARGET"],
    ENERGY: ["LOAD", "GREEN", "STORAGE", "CONTROL"],
  } as const;

  await page.emulateMedia({reducedMotion: "reduce"});
  for (const viewport of [{width: 1440, height: 900}, {width: 390, height: 844}, {width: 390, height: 600}]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const carousel = page.getByRole("region", {name: "光波互联业务轮播"});
    for (const [label, expectedNodes] of Object.entries(visualNodes)) {
      await carousel.getByRole("button", {name: `转到 ${label} 业务`}).click();
      await expect(carousel).toHaveCSS("background-color", "rgb(238, 238, 234)");
      const figure = page.getByRole("figure", {name: `${label}业务动态图形`});
      const nodes = figure.locator("[data-visual-node]");
      await expect(nodes).toHaveText(expectedNodes);
      expect(await nodes.evaluateAll((items) => items.every((item) =>
        item.scrollWidth <= item.clientWidth + 1 && item.scrollHeight <= item.clientHeight + 1,
      )), `${label} nodes overflow at ${viewport.width}x${viewport.height}`).toBe(true);
      const lineCounts = await nodes.evaluateAll((items) => items.map((item) => {
        const range = document.createRange();
        range.selectNodeContents(item);
        return range.getClientRects().length;
      }));
      expect(lineCounts.every((count) => count === 1),
        `${label} labels wrap unnaturally at ${viewport.width}x${viewport.height}: ${lineCounts.join(",")}`).toBe(true);
      await expectNoHorizontalOverflow(page);
    }

    await carousel.getByRole("button", {name: "转到 ENERGY 业务"}).click();
    const energyCopy = carousel.getByRole("heading", {level: 1}).locator("..");
    await expect(energyCopy).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    for (const side of ["top", "right", "bottom", "left"]) {
      await expect(energyCopy).toHaveCSS(`border-${side}-width`, "0px");
      await expect(energyCopy).toHaveCSS(`padding-${side}`, "0px");
    }
  }
});

test("home carousel releases into the preserved full home sections without console errors", async ({page}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/");
    await expectActiveHomeHero(page, "ai");
    for (const id of preservedHomeSections) await expect(page.locator(`section#${id}`)).toHaveCount(1);
    await page.locator("section#ai").scrollIntoViewIfNeeded();
    await expect(page.locator("section#ai")).toBeInViewport();
    await expect(page.locator(".home-models__names")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test("home carousel and logo loop retain 12px vertical scale clearance without horizontal overflow", async ({page}) => {
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/");
    await expectActiveHomeHero(page, "ai");
    await page.locator("section#ai").scrollIntoViewIfNeeded();
    await expect(page.locator("section#ai")).toBeInViewport();
    await expectNoHorizontalOverflow(page);
    for (const name of ["AI Providers", "AI Models"]) {
      const loop = page.getByRole("region", {name});
      await loop.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      expect(await loop.locator("li").evaluateAll((items) => Math.max(...items.map((item) =>
        new DOMMatrixReadOnly(getComputedStyle(item).transform).a,
      ))), `${name}: idle logo scale at ${width}px`).toBeLessThanOrEqual(1.01);
      const itemIndex = await loop.locator("li").evaluateAll((items) => {
        const root = items[0].closest('[role="region"]')!.getBoundingClientRect();
        const center = (root.left + root.right) / 2;
        return items.map((item, index) => ({index, rect: item.getBoundingClientRect()}))
          .filter(({rect}) => (rect.left + rect.right) / 2 >= root.left + 2 && (rect.left + rect.right) / 2 <= root.right - 2)
          .sort((a, b) => Math.abs((a.rect.left + a.rect.right) / 2 - center) - Math.abs((b.rect.left + b.rect.right) / 2 - center))[0]?.index ?? -1;
      });
      expect(itemIndex, `${name}: no hoverable logo at ${width}px`).toBeGreaterThanOrEqual(0);
      const before = await loop.locator("li").nth(itemIndex).boundingBox();
      expect(before).not.toBeNull();
      await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2);
      await expect(loop).toHaveAttribute("data-motion-state", "slowed");
      await page.waitForTimeout(220); // scaleOnHover transitions for 180ms
      const scaledItem = async () => loop.locator("li").evaluateAll((items) => {
        const loopRect = items[0].closest('[role="region"]')!.getBoundingClientRect();
        return items.flatMap((element) => {
          const logo = element as HTMLElement;
          const rect = logo.getBoundingClientRect();
          const scale = new DOMMatrixReadOnly(getComputedStyle(logo).transform).a;
          return scale > 1.15 && rect.right > loopRect.left && rect.left < loopRect.right
            ? [{scale, widthRatio: rect.width / logo.offsetWidth, heightRatio: rect.height / logo.offsetHeight,
              top: rect.top, bottom: rect.bottom, loopTop: loopRect.top, loopBottom: loopRect.bottom}]
            : [];
        })[0] ?? null;
      });
      await expect.poll(scaledItem, {message: `${name}: hover scale at ${width}px`}).not.toBeNull();
      const enlarged = (await scaledItem())!;
      expect(enlarged.scale, `${name}: hover scale at ${width}px`).toBeCloseTo(1.16, 2);
      expect(enlarged.widthRatio).toBeGreaterThan(1.15);
      expect(enlarged.heightRatio).toBeGreaterThan(1.15);
      expect(enlarged.top - enlarged.loopTop, `${name}: top scale clearance at ${width}px`).toBeGreaterThanOrEqual(12);
      expect(enlarged.loopBottom - enlarged.bottom, `${name}: bottom scale clearance at ${width}px`).toBeGreaterThanOrEqual(12);
    }
    await expectNoHorizontalOverflow(page);
  }
});

test("logo loop lights only loaded mono fallbacks on the dark ecosystem surface", async ({page}) => {
  const cdn = "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/";
  const monoURL = `${cdn}anthropic.svg`;
  const colorURL = `${cdn}zeroone-color.svg`;
  const svg = (fill: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path fill="${fill}" d="M10 110 60 10l50 100Z"/></svg>`;
  await page.route(`${cdn}anthropic-color.svg`, (route) => route.fulfill({status: 404, body: "No color variant"}));
  await page.route(monoURL, (route) => route.fulfill({contentType: "image/svg+xml", body: svg("#000")}));
  await page.route(colorURL, (route) => route.fulfill({contentType: "image/svg+xml", body: svg("#dfff46")}));
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/");
  const ecosystem = page.getByRole("region", {name: "AI Model Ecosystem"});
  await expect(ecosystem).toHaveCSS("background-color", "rgb(8, 8, 8)");
  const providers = page.getByRole("region", {name: "AI Providers"});
  const color = providers.getByRole("listitem", {name: "01.AI (零一万物)", exact: true}).locator("img");
  await color.scrollIntoViewIfNeeded();
  await expect.poll(() => color.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(color).toHaveCSS("filter", "none");
  const anthropic = providers.getByRole("listitem").filter({hasText: /^Anthropic$/});
  await anthropic.scrollIntoViewIfNeeded();
  const mono = anthropic.locator("img");
  await expect(mono).toHaveAttribute("src", monoURL);
  await expect.poll(() => mono.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(mono).toHaveCSS("filter", "brightness(0) invert(1)");
  await expect(mono.locator("..")).toHaveAttribute("data-image-stage", "mono");
  await expect(color.locator("..")).toHaveAttribute("data-image-stage", "color");
});

test("logo loop exposes exact settings and only the two original catalog lists", async ({page}) => {
  await page.goto("/");
  const providers = page.getByRole("region", {name: "AI Providers"});
  const models = page.getByRole("region", {name: "AI Models"});
  await expect(page.getByText("PROVIDERS / 136")).toBeVisible();
  await expect(page.getByText("MODELS / 72")).toBeVisible();
  for (const [loop, direction, count] of [[providers, "left", 136], [models, "right", 72]] as const) {
    await expect(loop).toHaveAttribute("data-direction", direction);
    await expect(loop).toHaveAttribute("data-speed", "160");
    await expect(loop).toHaveAttribute("data-hover-speed", "80");
    await expect(loop.getByRole("listitem")).toHaveCount(count);
    expect(await loop.locator("ul").count()).toBeGreaterThan(1);
    expect(await loop.locator('[aria-hidden="true"]').count()).toBeGreaterThanOrEqual(1);
    expect(await loop.locator('[aria-hidden="true"] [inert]').count()).toBeGreaterThanOrEqual(1);
    const vars = await loop.evaluate((element) => ({
      logoHeight: element.style.getPropertyValue("--logoloop-logo-height"),
      gap: element.style.getPropertyValue("--logoloop-gap"),
      fade: element.style.getPropertyValue("--logoloop-fade-color"),
      padding: getComputedStyle(element).paddingTop,
    }));
    expect(vars).toMatchObject({logoHeight: "120px", gap: "80px", fade: "#080808"});
    expect(parseFloat(vars.padding)).toBeGreaterThan(0);
  }
});

test("logo loop tracks move in opposite directions, slow on hover and stop for reduced motion", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/");
  const loops = [page.getByRole("region", {name: "AI Providers"}), page.getByRole("region", {name: "AI Models"})];
  async function offset(loop: Locator) {
    return loop.locator(":scope > div").first().evaluate((track) => {
      const transform = getComputedStyle(track).transform;
      return new DOMMatrixReadOnly(transform === "none" ? undefined : transform).m41;
    });
  }
  for (const [index, loop] of loops.entries()) {
    await loop.scrollIntoViewIfNeeded();
    await expect(loop).toHaveAttribute("data-motion-state", "running");
    await expect.poll(() => offset(loop)).not.toBe(0);
    const start = await offset(loop);
    await page.waitForTimeout(450);
    const normalDelta = (await offset(loop)) - start;
    expect(Math.abs(normalDelta)).toBeGreaterThan(35);
    expect(Math.sign(normalDelta)).toBe(index === 0 ? -1 : 1);
    await loop.hover();
    await expect(loop).toHaveAttribute("data-motion-state", "slowed");
    await page.waitForTimeout(500);
    const slowedStart = await offset(loop);
    await page.waitForTimeout(450);
    const slowedDelta = (await offset(loop)) - slowedStart;
    expect(Math.sign(slowedDelta)).toBe(Math.sign(normalDelta));
    expect(Math.abs(slowedDelta)).toBeGreaterThan(15);
    expect(Math.abs(slowedDelta)).toBeLessThan(Math.abs(normalDelta) * 0.8);
  }
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.reload();
  for (const loop of loops) {
    await expect(loop).toHaveAttribute("data-motion-state", "reduced");
    const start = await offset(loop);
    await page.waitForTimeout(450);
    expect(await offset(loop)).toBe(start);
  }
});

test("landing hero tones and first-section emphasis keep the header light", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  const cases = [
    {path: "/idc", hero: "hero", first: "service-matrix", tone: "dark", background: "rgb(8, 8, 8)"},
    {path: "/madeinchina", hero: "madeInChina-hero", first: "diagnostic", tone: "dark", background: "rgb(8, 8, 8)"},
    {path: "/network", hero: "network-hero", first: "products", tone: "dark", background: "rgb(8, 8, 8)"},
    {path: "/energy", hero: "energy-hero", first: "inputs", tone: "accent", background: "rgb(223, 255, 70)"},
    {path: "/about", hero: "about-hero", first: "identity", tone: "dark", background: "rgb(8, 8, 8)"},
  ] as const;
  let headerAppearance: {background: string; text: string} | undefined;
  for (const item of cases) {
    await page.goto(item.path);
    const hero = page.locator(`#${item.hero}`);
    await expect(hero).toHaveAttribute("data-tone", "light");
    await expect(hero).toHaveCSS("background-color", "rgb(251, 251, 249)");
    const first = page.locator("[data-content-module]").nth(1);
    await expect(first).toHaveAttribute("id", item.first);
    await expect(first).toHaveAttribute("data-tone", item.tone);
    await expect(first).toHaveCSS("background-color", item.background);
    const appearance = await page.locator(".site-header").evaluate((header) => ({
      background: getComputedStyle(header).backgroundColor,
      text: getComputedStyle(header.querySelector("nav a")!).color,
    }));
    headerAppearance ??= appearance;
    expect(appearance, `${item.path} header`).toEqual(headerAppearance);
    await expectNoHorizontalOverflow(page);
  }
});

test("home carousel desktop and mobile visual captures", async ({page}, testInfo) => {
  for (const [label, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]] as const) {
    await page.setViewportSize({width, height});
    await page.goto("/");
    await expectActiveHomeHero(page, "ai");
    await page.screenshot({path: testInfo.outputPath(`home-hero-${label}-ai.png`)});
    await page.getByRole("navigation", {name: "业务领域进度"}).getByRole("button", {name: "转到 ENERGY 业务"}).click();
    await expectActiveHomeHero(page, "energy");
    await page.screenshot({path: testInfo.outputPath(`home-hero-${label}-energy.png`)});
    await page.goto("/energy");
    await page.screenshot({path: testInfo.outputPath(`landing-hero-${label}-energy.png`)});
  }
});
