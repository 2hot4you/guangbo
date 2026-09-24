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

test("AI and IDC hero graphics animate unless reduced motion is requested", async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  for (const path of ["/ai", "/idc"]) {
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.goto(path);
    const motionLayers = page.locator("#hero [data-motion-layer]");
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

test("energy mobile hero keeps its overview and labelled placeholder compact", async ({page}) => {
  await page.setViewportSize({width: 360, height: 900});
  await page.goto("/energy");
  const hero = await page.locator("#energy-hero").boundingBox();
  const placeholder = await page.getByRole("figure", {name: "清洁能源项目视觉占位"}).boundingBox();
  expect(hero!.height).toBeLessThanOrEqual(1000);
  expect(placeholder!.y + placeholder!.height).toBeLessThanOrEqual(900);
  await expect(page.getByText("项目图片尚待确认", {exact: true})).toBeVisible();
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
