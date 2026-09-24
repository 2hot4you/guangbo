# 首页五业务滚动 Hero 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建首页五业务滚动驱动 Hero，保留下方全部完整内容，修复切页滚动归零，并统一五个一级内页的浅色首屏。

**Architecture:** 首页由服务端 `HomePage` 组装五个业务状态数据，客户端 `HomeHeroStory` 使用 `IntersectionObserver` 将自然滚动位置映射为活动状态。五种图形由独立视觉组件渲染，CSS 负责 sticky 舞台、布局变体、活动态动画和 reduced-motion；路由切页归零由独立布局组件负责，不再耦合在移动导航中。

**Tech Stack:** Next.js App Router、React 19、TypeScript、CSS Modules、Tailwind CSS v4、HeroUI v3、Vitest、Testing Library、Playwright。

**Spec:** `docs/superpowers/specs/2026-09-24-scroll-driven-home-hero-design.md`

## Global Constraints

- 首页五状态顺序固定为 AI、COMPUTE、XINCHUANG、LINK、ENERGY。
- 五状态只是首页开场，不删除、折叠、合并或缩短下方现有业务模块。
- 使用自然纵向滚动和 `IntersectionObserver`；不得拦截滚轮，不增加自动轮播或第三方滚动库。
- 服务端 HTML 必须包含五个状态的标题、说明和链接；页面只能有一个 H1。
- `prefers-reduced-motion: reduce` 下停止连续动画和切换过渡。
- 路由变化后 `window.scrollY` 必须为 `0`，同时 `#main-content` 获得焦点且聚焦本身不滚动页面。
- `/idc`、`/madeinchina`、`/network`、`/energy`、`/about` 的 Hero 必须为浅色；原 Hero 强调色移到第一正文栏目。
- 不新增图片资产、价格、SLA、库存、客户、资质、联系方式或资源承诺。

## Review Focus

- 浏览器不支持 `IntersectionObserver`：五个状态按自然顺序可读，进度按钮不应导致异常。
- 快速前后滚动跨过多个标记：活动索引必须与最接近舞台中心的标记一致，不停留在跳过的状态。
- 粘性 Header 高度和手机地址栏变化：Hero 不应被 Header 遮挡，也不得产生水平溢出。
- 路由切换同时发生焦点和滚动复位：最终必须稳定在 `scrollY = 0`，不能回到约 81px。
- reduced-motion 与非活动状态：前者全部动画停止，后者连续动画暂停，只允许当前状态运行。

---

## 文件结构与任务依赖

第一层可并行实施 Task 1、Task 2、Task 3；三者文件归属不重叠。Task 4 在前三项通过审查后执行整站集成。

- `src/components/layout/route-transition-focus.tsx`：全站路由变化后的焦点与滚动管理。
- `src/components/marketing/home-hero-story.tsx`：五状态数据类型、观察器状态和进度导航。
- `src/components/marketing/home-hero-visual.tsx`：五种圆形业务图形。
- `src/components/marketing/home-hero-story.module.css`：sticky 舞台、响应式布局、状态过渡和动画。
- `src/components/marketing/home-page.tsx`：服务端组装 Hero 数据并保留原有完整正文。
- `src/components/marketing/landing-page-primitives.tsx`：为 Hero/Section 输出可测试的 `data-tone`。
- 五个 `*-landing-page.tsx`：浅色 Hero 与第一正文栏目色调迁移。
- `e2e/public-site.spec.ts`：路由归零、滚动状态、动画、色调及回归验收。

### Task 1: 路由切换焦点与滚动归零

**Files:**
- Create: `src/components/layout/route-transition-focus.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/mobile-navigation.tsx`
- Modify: `tests/components/site-navigation.test.tsx`

**Interfaces:**
- Consumes: Next.js `usePathname(): string`、现有 `main#main-content[tabIndex=-1]`。
- Produces: `RouteTransitionFocus(): null`，在 pathname 变化后执行无滚动聚焦和即时滚动归零。

- [ ] **Step 1: 写失败测试，锁定根因修复行为**

在 `tests/components/site-navigation.test.tsx` 引入 `RouteTransitionFocus`，加入 pathname 变化测试。测试必须证明生产代码缺失时失败于“没有滚动归零/没有 preventScroll 聚焦”，而不是只断言组件存在。

```tsx
it("focuses main without scrolling it and resets a changed route to the absolute top", async () => {
  const scrollTo = vi.fn();
  vi.stubGlobal("scrollTo", scrollTo);
  const focus = vi.spyOn(HTMLElement.prototype, "focus");
  const view = render(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);

  pathname = "/idc";
  view.rerender(<><RouteTransitionFocus /><main id="main-content" tabIndex={-1} /></>);

  await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({left: 0, top: 0, behavior: "auto"}));
  expect(focus).toHaveBeenCalledWith({preventScroll: true});
});
```

- [ ] **Step 2: 运行失败测试**

Run: `pnpm exec vitest run tests/components/site-navigation.test.tsx`

Expected: FAIL，因为 `RouteTransitionFocus` 尚不存在。

- [ ] **Step 3: 实现独立的路由过渡组件**

创建客户端组件，首次挂载不执行；pathname 改变时临时覆盖根元素的内联 `scrollBehavior`，先无滚动聚焦，再归零，并在下一帧恢复原值。

```tsx
"use client";

import {usePathname} from "next/navigation";
import {useEffect, useRef} from "react";

export function RouteTransitionFocus() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    document.getElementById("main-content")?.focus({preventScroll: true});
    window.scrollTo({left: 0, top: 0, behavior: "auto"});
    const frame = window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
```

在 `src/app/layout.tsx` 的 `SiteHeader` 后渲染 `<RouteTransitionFocus />`。从 `MobileNavigation` 删除 pathname 变化后聚焦 `main` 的 effect 和 `previousPathname` ref；抽屉仍通过 pathname key 关闭。

- [ ] **Step 4: 运行导航测试并确认通过**

Run: `pnpm exec vitest run tests/components/site-navigation.test.tsx`

Expected: PASS；原抽屉关闭、Home 首项和焦点测试仍通过。

- [ ] **Step 5: 提交 Task 1**

```bash
git add src/components/layout/route-transition-focus.tsx src/app/layout.tsx src/components/layout/mobile-navigation.tsx tests/components/site-navigation.test.tsx
git commit -m "fix: reset route transitions to page top"
```

### Task 2: 首页五状态滚动 Hero

**Files:**
- Create: `src/components/marketing/home-hero-story.tsx`
- Create: `src/components/marketing/home-hero-visual.tsx`
- Create: `src/components/marketing/home-hero-story.module.css`
- Create: `tests/components/home-hero-story.test.tsx`
- Modify: `src/components/marketing/home-page.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/components/marketing-page.test.tsx`

**Interfaces:**
- Produces:

```ts
export type HomeHeroVariant = "ai" | "compute" | "xinchang" | "link" | "energy";
export interface HomeHeroSlideContent {
  index: "01" | "02" | "03" | "04" | "05";
  label: "AI" | "COMPUTE" | "XINCHUANG" | "LINK" | "ENERGY";
  title: string;
  body: string;
  href: PublicPath;
  cta: string;
  variant: HomeHeroVariant;
}
export function HomeHeroStory({slides}: {slides: readonly HomeHeroSlideContent[]}): React.ReactElement;
export function HomeHeroVisual({variant, active}: {variant: HomeHeroVariant; active: boolean}): React.ReactElement;
```

- Consumes: `MarketingPage` 首页 hero 和 `ai/idc/madeinchina/network/energy` sections；只读取现有正文。

- [ ] **Step 1: 写失败的语义与无脚本回退测试**

创建 `tests/components/home-hero-story.test.tsx`。手写五个 literal slides，不从生产 builder 推导期望。

```tsx
it("server-renders five ordered business states with one h1 and five real links", () => {
  const html = renderToStaticMarkup(<HomeHeroStory slides={slides} />);
  render(<HomeHeroStory slides={slides} />);

  expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
  expect(screen.getAllByTestId("home-hero-slide").map((slide) => slide.dataset.domain))
    .toEqual(["ai", "compute", "xinchang", "link", "energy"]);
  expect(screen.getAllByRole("link")).toHaveLength(5);
  expect(html).toContain("大模型与AIGC");
  expect(html).toContain("绿电与清洁能源");
});

it("keeps all slides readable before progressive enhancement", () => {
  render(<HomeHeroStory slides={slides} />);
  expect(screen.getByTestId("home-hero-story")).toHaveAttribute("data-enhanced", "false");
  expect(screen.getAllByTestId("home-hero-slide")).toHaveLength(5);
});
```

- [ ] **Step 2: 运行测试并观察失败**

Run: `pnpm exec vitest run tests/components/home-hero-story.test.tsx`

Expected: FAIL，因为 Hero story 组件和类型尚不存在。

- [ ] **Step 3: 实现五种视觉组件**

`HomeHeroVisual` 为每个 variant 输出一个带明确标签的 `figure`，每个动画元素带 `data-motion-layer`。图形内容固定为：

```ts
const visualNodes = {
  ai: ["LLM", "IMAGE", "VIDEO"],
  compute: ["COMPUTE", "STORAGE", "NETWORK", "POWER", "COOLING"],
  xinchang: ["硬件", "系统", "应用", "数据"],
  link: ["站点", "接入", "传输", "目标"],
  energy: ["负荷", "绿电", "储能", "管理"],
} as const;
```

每个 `figure` 使用 `aria-label={`${label}业务动态图形`}`。装饰环 `aria-hidden="true"`；文字节点保留在可访问树中。

- [ ] **Step 4: 实现滚动 story 状态**

`HomeHeroStory` 初始 `enhanced=false`、`activeIndex=0`。`useEffect` 在浏览器支持 `IntersectionObserver` 时观察五个 `[data-home-hero-step]`，按中心距离选择活动状态；不支持时只将 `enhanced` 保持 false，让五屏自然排列。

进度按钮实现：

```tsx
function goTo(index: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  stepRefs.current[index]?.scrollIntoView({block: "center", behavior: reduced ? "auto" : "smooth"});
}
```

活动 article 使用 `data-active={index === activeIndex}`；只有 enhanced 状态下才给非活动 article `aria-hidden="true"`。状态切换不得调用 `focus()`。

- [ ] **Step 5: 实现 sticky、布局和动画 CSS**

在 CSS Module 中提供：

- `[data-enhanced="true"]` 才启用 sticky/重叠 slide；默认五个 article 自然排列。
- 桌面 `top: 5rem; min-height: calc(100svh - 5rem)`。
- 五个 variant 分别使用左右、上下和错位布局，不复用单一网格顺序。
- `[data-active="false"] [data-motion-layer] { animation-play-state: paused; }`。
- `[data-active="true"] [data-motion-layer] { animation-play-state: running; }`。
- `@media (prefers-reduced-motion: reduce)` 中所有 motion layer `animation: none`，slide transition `none`。
- 360px 下圆形视觉最大宽度 `min(78vw, 19rem)`，进度横向放在底部。

- [ ] **Step 6: 在 HomePage 组装真实五状态数据**

用当前首页内容创建 literal 数组，不删除 `home-ai`、`home-idc`、`home-domains`、`delivery` 或 `about` 模块。

```tsx
const heroSlides = [
  {index: "01", label: "AI", title: page.hero.title, body: page.hero.lead, href: "/ai", cta: "探索大模型", variant: "ai"},
  {index: "02", label: "COMPUTE", title: idc.title, body: idc.body!, href: "/idc", cta: "查看IDC与算力", variant: "compute"},
  {index: "03", label: "XINCHUANG", title: supporting[0].title, body: supporting[0].body!, href: "/madeinchina", cta: "了解信创与数字化", variant: "xinchang"},
  {index: "04", label: "LINK", title: supporting[1].title, body: supporting[1].body!, href: "/network", cta: "查看专线网络", variant: "link"},
  {index: "05", label: "ENERGY", title: supporting[2].title, body: supporting[2].body!, href: "/energy", cta: "了解清洁能源", variant: "energy"},
] as const satisfies readonly HomeHeroSlideContent[];
```

用 `<HomeHeroStory slides={heroSlides} />` 替换旧 `.home-hero`，保留其后的所有 sections。清理 `globals.css` 中只供旧 `.home-hero`、`.home-signal` 和 `.home-domain-strip` 使用的规则，但保留下方 `DomainVisual` 仍使用的 `home-orbit-spin`。

- [ ] **Step 7: 更新首页集成测试**

修改 `tests/components/marketing-page.test.tsx`：

- 断言五个 Hero 状态顺序与五个真实链接。
- 断言首页仍只有一个 H1。
- 断言下方 section IDs 仍是 `ai, idc, madeinchina, network, energy, delivery, about`。
- 断言下方原有模型生态、VPS、GPU、信创、网络和能源条目仍全部存在。
- 删除只对应旧 `.home-eyebrow`、`.home-signal__label` 和 `.home-domain-strip` 的断言。

- [ ] **Step 8: 运行 Task 2 测试**

Run: `pnpm exec vitest run tests/components/home-hero-story.test.tsx tests/components/marketing-page.test.tsx`

Expected: PASS；无 act warning、hydration warning 或 console error。

- [ ] **Step 9: 提交 Task 2**

```bash
git add src/components/marketing/home-hero-story.tsx src/components/marketing/home-hero-visual.tsx src/components/marketing/home-hero-story.module.css src/components/marketing/home-page.tsx src/app/globals.css tests/components/home-hero-story.test.tsx tests/components/marketing-page.test.tsx
git commit -m "feat: add scroll-driven homepage hero story"
```

### Task 3: 一级内页浅色 Hero 与色调迁移

**Files:**
- Modify: `src/components/marketing/landing-page-primitives.tsx`
- Modify: `src/components/marketing/landing-pages.module.css`
- Modify: `src/components/marketing/idc-landing-page.tsx`
- Modify: `src/components/marketing/xinchang-landing-page.tsx`
- Modify: `src/components/marketing/network-landing-page.tsx`
- Modify: `src/components/marketing/energy-landing-page.tsx`
- Modify: `tests/components/landing-page-primitives.test.tsx`
- Modify: `tests/components/ai-idc-landing-pages.test.tsx`
- Modify: `tests/components/business-landing-pages.test.tsx`

**Interfaces:**
- Extends existing `LandingHero` and `LandingSection` output with `data-tone: LandingTone`.
- Preserves all public props, module IDs, H1s, links and content.

- [ ] **Step 1: 写失败的色调映射测试**

在 primitives 测试中断言 `data-tone`；在页面测试中手写路径映射：

```tsx
it.each([
  {Component: IdcLandingPage, page: idc, hero: "hero", first: "service-matrix", firstTone: "dark"},
  {Component: XinchangLandingPage, page: madeInChina, hero: "madeInChina-hero", first: "diagnostic", firstTone: "dark"},
  {Component: NetworkLandingPage, page: network, hero: "network-hero", first: "products", firstTone: "dark"},
  {Component: EnergyLandingPage, page: energy, hero: "energy-hero", first: "inputs", firstTone: "accent"},
  {Component: AboutLandingPage, page: about, hero: "about-hero", first: "identity", firstTone: "dark"},
])("uses a light hero and moves emphasis to the first section", ({Component, page, hero, first, firstTone}) => {
  render(<Component page={page} />);
  expect(document.getElementById(hero)).toHaveAttribute("data-tone", "light");
  expect(document.getElementById(first)).toHaveAttribute("data-tone", firstTone);
});
```

- [ ] **Step 2: 运行失败测试**

Run: `pnpm exec vitest run tests/components/landing-page-primitives.test.tsx tests/components/ai-idc-landing-pages.test.tsx tests/components/business-landing-pages.test.tsx`

Expected: FAIL，因为现有内页色调不符合映射且 primitives 未输出 `data-tone`。

- [ ] **Step 3: 输出 data-tone 并迁移页面色调**

在 `LandingHero` 和 `LandingSection` 的 section 元素增加 `data-tone={tone}`。修改页面：

- IDC Hero `dark → light`，service matrix `light → dark`。
- 信创 Hero `dark → light`，diagnostic `muted → dark`。
- 专线 Hero `dark → light`，products `light → dark`。
- 绿电 Hero `accent → light`，inputs `light → accent`。
- 关于 Hero 保持 light，identity 保持 dark。

- [ ] **Step 4: 调整迁移后局部颜色**

将 Hero 中的 `border-white/*`、`text-white/*`、`text-lime-300` 改为适合浅色面的 `border-black/*`、`text-black/*` 和 `var(--accent)`。第一深色 section 中的列表边框、正文、链接和 metadata 改为 `currentColor` 或白色透明度；不得留下黑字落在深色背景上的组合。

IDC 动态图改为浅色变量：外环黑色透明边框、节点黑底白字、核心保持荧光色。正常和 reduced-motion 动画行为保持不变。

- [ ] **Step 5: 运行 Task 3 测试**

Run: `pnpm exec vitest run tests/components/landing-page-primitives.test.tsx tests/components/ai-idc-landing-pages.test.tsx tests/components/business-landing-pages.test.tsx`

Expected: PASS；每页仍有一个 H1 和九个内容模块。

- [ ] **Step 6: 提交 Task 3**

```bash
git add src/components/marketing/landing-page-primitives.tsx src/components/marketing/landing-pages.module.css src/components/marketing/idc-landing-page.tsx src/components/marketing/xinchang-landing-page.tsx src/components/marketing/network-landing-page.tsx src/components/marketing/energy-landing-page.tsx src/components/marketing/about-landing-page.tsx tests/components/landing-page-primitives.test.tsx tests/components/ai-idc-landing-pages.test.tsx tests/components/business-landing-pages.test.tsx
git commit -m "feat: unify landing heroes on light surfaces"
```

### Task 4: 整站浏览器集成与回归

**Files:**
- Modify: `e2e/public-site.spec.ts`

**Interfaces:**
- Consumes: Task 1 `RouteTransitionFocus`、Task 2 `[data-home-hero-*]` contract、Task 3 `[data-tone]` contract。
- Produces: Playwright acceptance coverage for the complete feature.

- [ ] **Step 1: 写失败的切页归零浏览器测试**

```ts
test("desktop and mobile route changes land at the absolute page top", async ({page}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/ai");
    await page.evaluate(() => window.scrollTo(0, 1400));
    if (width < 1280) {
      await page.getByRole("button", {name: "打开导航菜单"}).click();
      await page.getByRole("navigation", {name: "移动导航"})
        .getByRole("link", {name: "IDC与算力", exact: true}).click();
    } else {
      await page.getByRole("navigation", {name: "主导航"})
        .getByRole("link", {name: "IDC与算力", exact: true}).click();
    }
    await expect(page).toHaveURL(/\/idc$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator("#main-content")).toBeFocused();
  }
});
```

- [ ] **Step 2: 写滚动状态、反向滚动和进度导航测试**

对 `[data-home-hero-step]` 逐个执行 `scrollIntoView({block: "center"})`，断言唯一 `[data-home-hero-slide][data-active="true"]` 的 `data-domain` 依次为 `ai/compute/xinchang/link/energy`；再从 energy 反向滚动到 ai。另做一次 `ai → energy → xinchang` 的即时跨段滚动，分别等待活动状态稳定，防止快速跳过标记时停留在旧索引。点击 `04 / LINK` 进度按钮后断言 LINK 激活。

- [ ] **Step 3: 写动画与 reduced-motion 测试**

正常模式下：活动 slide 至少三个 `[data-motion-layer]` 的 `animationPlayState` 为 `running`，全部非活动 slide 的同类元素为 `paused`。reduced-motion 模式 reload 后，所有 motion layer 的 `animationName` 为 `none`。

- [ ] **Step 4: 写内容保留和内页色调测试**

- 首页滚动 Hero 后仍能找到下方 `#ai`、`#idc`、`#madeinchina`、`#network`、`#energy`、`#delivery`、`#about`。
- 访问五个一级页面，Hero 的 computed background 为浅色；第一正文栏目分别为深色、深色、深色、荧光、深色。
- Header computed background/文字状态在五页保持一致。

- [ ] **Step 5: 运行定向 E2E 并修复测试暴露的问题**

Run: `pnpm exec playwright test e2e/public-site.spec.ts --grep "absolute page top|home hero|landing hero" --output=/tmp/zhire-scroll-hero-targeted --workers=1`

Expected: PASS；没有 console error、超时或横向溢出。

- [ ] **Step 6: 运行完整验证**

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm exec playwright test --output=/tmp/zhire-scroll-hero-full --workers=1
git diff --check
```

Expected: 全部通过；生产构建继续静态生成 18 个页面。构建若只改写 `next-env.d.ts` 的 `.next/dev/types` 路径，恢复生成文件变动，不提交该噪音。

- [ ] **Step 7: 提交 Task 4**

```bash
git add e2e/public-site.spec.ts
git commit -m "test: verify scroll-driven hero and light landing intros"
```

### Task 5: 全分支审查、修复和归档

**Files:**
- Create: `.ccg/tasks/scroll-driven-home-hero/review.md`
- Modify: `.ccg/tasks/scroll-driven-home-hero/task.json`
- Inspect: `.ccg/spec/frontend/index.md`; append a reusable convention only when the final review identifies one.

**Interfaces:**
- Consumes: Tasks 1–4 的全部提交和验证结果。
- Produces: Critical/Warning/Info 审查结论、最终验证记录、归档任务。

- [ ] **Step 1: 生成全分支审查包并执行双路审查**

使用 antigravity 与 Claude reviewer 并行审查 spec 到 HEAD 的完整 diff；若本机 wrapper 仍缺失，在 review.md 中记录精确路径错误，并使用独立工程审查与 UI 审查代理作为回退。

- [ ] **Step 2: 修复 Critical 和 Warning**

每个修复先增加能复现问题的失败测试，再做最小修改。重新运行受影响测试；Critical 修复后重新进行双路范围审查。

- [ ] **Step 3: 执行最终验证**

重新运行 `pnpm test`、`pnpm typecheck`、`pnpm lint`、`pnpm build`、完整 Playwright 和 `git diff --check`。只引用本轮新鲜输出。

- [ ] **Step 4: 写审查记录并归档 CCG task**

将任务状态改为 completed，写入完整验证数字和遗留限制，然后移动到 `.ccg/tasks/archive/2026-09/scroll-driven-home-hero` 并提交：

```bash
git add .ccg/tasks/
git commit -m "chore: archive ccg task scroll-driven-home-hero"
```
