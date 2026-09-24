# 首页普通轮播与完整 LogoLoop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页 sticky 五业务故事改为普通可控轮播，并用 React Bits LogoLoop 展示 LobeHub Icons 完整 Provider 与 Model 目录。

**Architecture:** 服务端 `HomePage` 继续组装五组业务内容；客户端 `HomeHeroCarousel` 只管理自动播放、暂停、按钮、圆点、键盘与 Pointer 手势。LobeHub 目录由维护脚本同步为本地静态 manifest，`ModelEcosystemLoop` 通过官方 CDN URL 将目录传给通用 `LogoLoop`，生产构建不依赖目录网络请求。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、CSS Modules、React Bits LogoLoop、`@lobehub/icons@5.21.0`、Vitest、Testing Library、Playwright。

**Spec:** `docs/superpowers/specs/2026-09-24-home-carousel-logo-loop-design.md`

## Global Constraints

- Banner 顺序固定为 AI、COMPUTE、XINCHUANG、LINK、ENERGY，自动播放间隔固定 6000ms。
- 支持左右按钮、五个圆点、左右方向键和横向 Pointer 滑动；不得监听或拦截 wheel，不得对手势调用 `preventDefault()`。
- 轮播触控面使用 `touch-action: pan-y`；纵向页面滚动必须保持原生行为。
- hover、focus-within、`document.hidden` 和 `prefers-reduced-motion: reduce` 必须暂停自动播放；低动态模式取消 slide transition。
- 首页首屏以下全部现有业务模块保持不变，页面继续只有一个 H1。
- `@lobehub/icons` 固定为 `5.21.0`；完整目录固定为 136 Provider 与 72 Model，不包含 Application。
- Provider LogoLoop 使用 `direction="left"`；Model LogoLoop 使用 `direction="right"`。
- 两条 LogoLoop 均使用 `speed={160}`、`hoverSpeed={80}`、`logoHeight={120}`、`gap={80}`、`fadeOut` 和 `scaleOnHover`。
- 图标来自 `getLobeIconCDN(..., {cdn: "unpkg", format: "svg", type: "color"})`；图标失败时名称仍可见。
- `prefers-reduced-motion: reduce` 下 LogoLoop 不启动 requestAnimationFrame；静态目录仍可横向浏览。
- 不增加外部 Logo 链接、模型价格、库存、购买、登录或在线调用功能。

## Review Focus

- 208 个目录项中的 CDN 图片部分或全部加载失败时，轨道仍有稳定尺寸、名称可读且没有无限等待。
- 390px 宽度使用 120px Logo 和 80px gap 时，轨道自身裁切但 `documentElement.scrollWidth` 不超过 viewport。
- 用户正在 hover/focus、标签页从 hidden 恢复或低动态偏好运行中切换时，自动播放和 RAF 不重复注册。
- Pointer 横向移动不足 48px、横纵位移接近或纯纵向移动时，不应误切 Banner。
- 长时间运行跨越 LogoLoop 序列边界和 Banner 第五张回第一张时，不出现空白帧、跳焦点或控制台错误。

---

## 文件结构与依赖

Layer 1 可并行执行 Task 1、Task 2、Task 4；文件归属不重叠。Task 3 依赖 Task 1 和 Task 2。Task 5 依赖 Task 3 和 Task 4。Task 6 在全部实现完成后执行。

- `src/content/lobe-icon-catalog.ts`：固定版本完整目录与类型。
- `scripts/sync-lobe-icon-catalog.mjs`：维护时同步官方 Model/Provider 分类。
- `src/components/ui/logo-loop.tsx`：React Bits 循环算法、暂停与低动态行为。
- `src/components/ui/logo-loop.module.css`：轨道、渐隐、hover scale 与静态回退。
- `src/components/marketing/model-ecosystem-loop.tsx`：目录、CDN URL 和两条业务轨道。
- `src/components/marketing/model-ecosystem-loop.module.css`：模型生态布局和失败回退。
- `src/components/marketing/home-hero-carousel.tsx`：普通五屏轮播状态与交互。
- `src/components/marketing/home-hero-carousel.module.css`：Banner 布局、过渡和控制。
- `src/components/marketing/home-hero-types.ts`：Hero 数据类型，避免视觉组件依赖旧 story。

### Task 1: 固定 LobeHub 完整目录

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `scripts/sync-lobe-icon-catalog.mjs`
- Create: `src/content/lobe-icon-catalog.ts`
- Create: `tests/content/lobe-icon-catalog.test.ts`

**Interfaces:**
- Produces: `LobeCatalogItem`, `LOBE_ICON_CATALOG_VERSION`, `lobeProviderCatalog`, `lobeModelCatalog`。
- Consumes: LobeHub 官方 `skills.md` 与每个 component skill 中的 `Source: src/<IconId>/index.mdx`。

- [ ] **Step 1: 写目录失败测试**

```ts
import {describe, expect, it} from "vitest";
import {
  LOBE_ICON_CATALOG_VERSION,
  lobeModelCatalog,
  lobeProviderCatalog,
} from "@/content/lobe-icon-catalog";

describe("LobeHub catalog snapshot", () => {
  it("pins the complete provider and model categories", () => {
    expect(LOBE_ICON_CATALOG_VERSION).toBe("5.21.0");
    expect(lobeProviderCatalog).toHaveLength(136);
    expect(lobeModelCatalog).toHaveLength(72);
    expect(lobeProviderCatalog.every((item) => item.category === "provider")).toBe(true);
    expect(lobeModelCatalog.every((item) => item.category === "model")).toBe(true);
  });

  it("keeps ids unique inside each category and excludes applications", () => {
    expect(new Set(lobeProviderCatalog.map((item) => item.id)).size).toBe(136);
    expect(new Set(lobeModelCatalog.map((item) => item.id)).size).toBe(72);
    expect([...lobeProviderCatalog, ...lobeModelCatalog].some((item) => item.name === "Cursor")).toBe(false);
  });
});
```

- [ ] **Step 2: 运行测试并确认缺少模块**

Run: `pnpm exec vitest run tests/content/lobe-icon-catalog.test.ts`

Expected: FAIL，提示 `@/content/lobe-icon-catalog` 不存在。

- [ ] **Step 3: 安装固定依赖**

Run: `pnpm add @lobehub/icons@5.21.0`

Expected: `package.json` 与 `pnpm-lock.yaml` 只增加该生产依赖。

- [ ] **Step 4: 创建同步脚本**

脚本必须按行解析分类，避免把 Application 混入；每个目录项从 component skill 的 Source 字段取得 CDN id：

```js
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";

const skillsUrl = "https://icons.lobehub.com/skills.md";
const output = path.resolve("src/content/lobe-icon-catalog.ts");
const packageJson = JSON.parse(await readFile("node_modules/@lobehub/icons/package.json", "utf8"));

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function collectEntries(markdown) {
  let category = null;
  const entries = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (line === "#### Model") { category = "model"; continue; }
    if (line === "#### Provider") { category = "provider"; continue; }
    if (/^#{1,4} /.test(line)) { category = null; continue; }
    if (!category) continue;
    const match = line.match(/^- \[([^\]]+)\]\((https:\/\/icons\.lobehub\.com\/skills\/components\/[^)]+\.md)\)/);
    if (match) entries.push({category, name: match[1], docs: match[2]});
  }
  return entries;
}

async function resolveIcon(entry) {
  const markdown = await fetchText(entry.docs);
  const source = markdown.match(/Source: `src\/([^/]+)\/index\.mdx`/);
  if (!source) throw new Error(`Missing icon source for ${entry.name}`);
  return {id: source[1], name: entry.name, category: entry.category};
}

async function resolveInBatches(entries, size = 12) {
  const result = [];
  for (let index = 0; index < entries.length; index += size) {
    result.push(...await Promise.all(entries.slice(index, index + size).map(resolveIcon)));
  }
  return result;
}

const entries = await resolveInBatches(collectEntries(await fetchText(skillsUrl)));
const providers = entries.filter((item) => item.category === "provider").sort((a, b) => a.name.localeCompare(b.name));
const models = entries.filter((item) => item.category === "model").sort((a, b) => a.name.localeCompare(b.name));
if (providers.length !== 136 || models.length !== 72) {
  throw new Error(`Catalog count changed: providers=${providers.length}, models=${models.length}`);
}
const body = `export type LobeCatalogCategory = "provider" | "model";\nexport interface LobeCatalogItem { readonly id: string; readonly name: string; readonly category: LobeCatalogCategory; }\nexport const LOBE_ICON_CATALOG_VERSION = ${JSON.stringify(packageJson.version)};\nexport const lobeProviderCatalog = ${JSON.stringify(providers, null, 2)} as const satisfies readonly LobeCatalogItem[];\nexport const lobeModelCatalog = ${JSON.stringify(models, null, 2)} as const satisfies readonly LobeCatalogItem[];\n`;
await writeFile(output, body);
```

- [ ] **Step 5: 运行同步脚本并检查生成结果**

Run: `node scripts/sync-lobe-icon-catalog.mjs`

Expected: 创建 `src/content/lobe-icon-catalog.ts`，Provider 136、Model 72，无重复分类内 ID。

- [ ] **Step 6: 运行目录测试、类型检查与格式检查**

Run: `pnpm exec vitest run tests/content/lobe-icon-catalog.test.ts && pnpm typecheck && pnpm exec eslint scripts/sync-lobe-icon-catalog.mjs src/content/lobe-icon-catalog.ts tests/content/lobe-icon-catalog.test.ts && git diff --check`

Expected: 全部 PASS。

- [ ] **Step 7: 提交 Task 1**

```bash
git add package.json pnpm-lock.yaml scripts/sync-lobe-icon-catalog.mjs src/content/lobe-icon-catalog.ts tests/content/lobe-icon-catalog.test.ts
git commit -m "feat: add complete LobeHub icon catalog"
```

### Task 2: React Bits LogoLoop 通用组件

**Files:**
- Create: `src/components/ui/logo-loop.tsx`
- Create: `src/components/ui/logo-loop.module.css`
- Create: `tests/components/logo-loop.test.tsx`

**Interfaces:**
- Produces:

```ts
export interface LogoLoopImageItem {
  src: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
}
export interface LogoLoopNodeItem { node: React.ReactNode; title: string; ariaLabel?: string; }
export type LogoLoopItem = LogoLoopImageItem | LogoLoopNodeItem;
export interface LogoLoopProps {
  logos: readonly LogoLoopItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoLoopItem, key: React.Key) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
export const LogoLoop: React.MemoExoticComponent<(props: LogoLoopProps) => React.ReactElement>;
```

- [ ] **Step 1: 写失败的结构、参数与低动态测试**

测试使用两个 image items，断言第一份列表可访问、第二份副本隐藏、CSS variables 为 120px/80px、方向与速度 data 属性正确。另 mock `matchMedia("(prefers-reduced-motion: reduce)")` 为 true，断言 `requestAnimationFrame` 未被调用。

```tsx
render(<LogoLoop logos={logos} direction="left" speed={160} hoverSpeed={80} logoHeight={120} gap={80} fadeOut scaleOnHover ariaLabel="Providers" />);
const region = screen.getByRole("region", {name: "Providers"});
expect(region).toHaveAttribute("data-direction", "left");
expect(region).toHaveAttribute("data-speed", "160");
expect(region).toHaveAttribute("data-hover-speed", "80");
expect(region.style.getPropertyValue("--logoloop-logo-height")).toBe("120px");
expect(region.style.getPropertyValue("--logoloop-gap")).toBe("80px");
expect(within(region).getAllByRole("list")).toHaveLength(1);
```

- [ ] **Step 2: 运行测试并确认缺少组件**

Run: `pnpm exec vitest run tests/components/logo-loop.test.tsx`

Expected: FAIL，提示 `@/components/ui/logo-loop` 不存在。

- [ ] **Step 3: 移植并类型化 React Bits 组件**

以用户提供的 LogoLoop 源码为算法基线，使用 CSS Module；根节点必须输出可测试且有产品含义的状态：

```tsx
<div
  aria-label={ariaLabel}
  className={rootClassName}
  data-direction={direction}
  data-hover-speed={effectiveHoverSpeed}
  data-motion-state={reducedMotion ? "reduced" : isSlowed ? "slowed" : "running"}
  data-speed={speed}
  role="region"
  style={containerStyle}
>
```

新增 `useReducedMotion`，低动态时 `useAnimationLoop` 直接返回且不安排 RAF：

```ts
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}
```

hover 与 focus-within 共用 `isSlowed`，`onFocusCapture` 设为 true；`onBlurCapture` 仅在 relatedTarget 离开根节点时恢复。`useAnimationLoop` 的依赖必须包含 `disabled`，disabled 时取消现有 RAF、清空 timestamp 并保留静态 transform。

- [ ] **Step 4: 实现 CSS Module**

完整迁移 React Bits 的 horizontal/vertical、track、list、item、fade 和 scale 规则；变量名称统一为 `--logoloop-gap`、`--logoloop-logo-height`、`--logoloop-fade-color`。根节点 `max-width: 100%; overflow: clip;`，scale 模式按 120px 高度增加上下 padding。低动态模式允许 `.track {overflow-x: auto; transform: none !important;}`，并关闭 transition。

- [ ] **Step 5: 验证 RED→GREEN 和 cleanup**

Run: `pnpm exec vitest run tests/components/logo-loop.test.tsx`

Expected: PASS；追加 unmount 测试，确认最后一个 RAF 被 cancel，ResizeObserver 全部 disconnect。

- [ ] **Step 6: 运行范围验证**

Run: `pnpm exec vitest run tests/components/logo-loop.test.tsx && pnpm typecheck && pnpm exec eslint src/components/ui/logo-loop.tsx tests/components/logo-loop.test.tsx && git diff --check`

Expected: 全部 PASS。

- [ ] **Step 7: 提交 Task 2**

```bash
git add src/components/ui/logo-loop.tsx src/components/ui/logo-loop.module.css tests/components/logo-loop.test.tsx
git commit -m "feat: add accessible React Bits logo loop"
```

### Task 3: 完整模型生态双轨 LogoLoop

**Files:**
- Create: `src/components/marketing/model-ecosystem-loop.tsx`
- Create: `src/components/marketing/model-ecosystem-loop.module.css`
- Create: `tests/components/model-ecosystem-loop.test.tsx`

**Interfaces:**
- Consumes: `lobeProviderCatalog`, `lobeModelCatalog`, `LogoLoop`, `getLobeIconCDN`。
- Produces: `ModelEcosystemLoop(): React.ReactElement`。

- [ ] **Step 1: 写失败的完整目录与固定参数测试**

渲染真实组件并断言：

```tsx
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
}
expect(within(providers).getAllByRole("listitem")).toHaveLength(136);
expect(within(models).getAllByRole("listitem")).toHaveLength(72);
expect(screen.getByText("PROVIDERS / 136")).toBeInTheDocument();
expect(screen.getByText("MODELS / 72")).toBeInTheDocument();
```

- [ ] **Step 2: 运行测试并确认缺少组件**

Run: `pnpm exec vitest run tests/components/model-ecosystem-loop.test.tsx`

Expected: FAIL，提示组件不存在。

- [ ] **Step 3: 实现 CDN item 与失败回退**

```tsx
function CatalogMark({item}: {item: LobeCatalogItem}) {
  const [failed, setFailed] = useState(false);
  const src = getLobeIconCDN(item.id, {cdn: "unpkg", format: "svg", type: "color"});
  return (
    <span className={styles.mark} title={item.name}>
      {!failed && <img alt="" decoding="async" height={120} loading="lazy" onError={() => setFailed(true)} src={src} width={120} />}
      <span>{item.name}</span>
    </span>
  );
}
```

用 node items 传入 LogoLoop，避免 image item 只能显示图片而无法同时显示名称。Provider 与 Model 分别传入完整 manifest，并使用固定 props：

```tsx
<LogoLoop logos={providerLogos} direction="left" speed={160} hoverSpeed={80} logoHeight={120} gap={80} fadeOut fadeOutColor="#080808" scaleOnHover ariaLabel="AI Providers" />
<LogoLoop logos={modelLogos} direction="right" speed={160} hoverSpeed={80} logoHeight={120} gap={80} fadeOut fadeOutColor="#080808" scaleOnHover ariaLabel="AI Models" />
```

- [ ] **Step 4: 实现双轨版式**

CSS Module 为每条轨道提供标签、上下分隔线和至少 176px 高度；`.mark` 使用透明背景、纵向 Logo+名称布局，图片固定 120×120，名称限制两行。根 section 与轨道 wrapper 均 `min-width: 0; overflow: clip;`，scale 后仍有 12px 安全空间。

- [ ] **Step 5: 添加图片失败测试**

触发第一张图片 `error`，断言图片移除、对应名称仍存在、其他 207 项不受影响。

- [ ] **Step 6: 运行 Task 3 验证**

Run: `pnpm exec vitest run tests/components/model-ecosystem-loop.test.tsx tests/components/logo-loop.test.tsx tests/content/lobe-icon-catalog.test.ts && pnpm typecheck && pnpm lint && git diff --check`

Expected: 全部 PASS。

- [ ] **Step 7: 提交 Task 3**

```bash
git add src/components/marketing/model-ecosystem-loop.tsx src/components/marketing/model-ecosystem-loop.module.css tests/components/model-ecosystem-loop.test.tsx
git commit -m "feat: add complete provider and model logo loops"
```

### Task 4: 普通五业务轮播 Banner

**Files:**
- Create: `src/components/marketing/home-hero-types.ts`
- Create: `src/components/marketing/home-hero-carousel.tsx`
- Create: `src/components/marketing/home-hero-carousel.module.css`
- Create: `tests/components/home-hero-carousel.test.tsx`
- Modify: `src/components/marketing/home-hero-visual.tsx`
- Modify: `src/components/marketing/home-hero-story.tsx`

**Interfaces:**
- Produces: `HomeHeroVariant`, `HomeHeroSlideContent`, `HomeHeroCarousel({slides, autoplayMs?})`。
- Consumes: `HomeHeroVisual({variant, active})`。

- [ ] **Step 1: 抽取共享类型且保持旧 story 编译**

创建：

```ts
import type {PublicPath} from "@/content";
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
```

让 `home-hero-story.tsx` re-export 这两个类型，让现有首页在 Task 5 前继续编译；`home-hero-visual.tsx` 改从 types 文件导入。

- [ ] **Step 2: 写轮播失败测试**

覆盖：初始 AI/单 H1、next/previous 循环、圆点、ArrowLeft/ArrowRight、6000ms 自动前进、hover/focus/hidden/reduced-motion 暂停、横向 48px 手势切换、纵向和短手势不切换且事件未被 preventDefault。

```tsx
fireEvent.pointerDown(region, {clientX: 260, clientY: 160, pointerId: 1});
const up = createEvent.pointerUp(region, {clientX: 180, clientY: 166, pointerId: 1});
fireEvent(region, up);
expect(up.defaultPrevented).toBe(false);
expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("IDC与算力");
```

- [ ] **Step 3: 运行测试并确认缺少组件**

Run: `pnpm exec vitest run tests/components/home-hero-carousel.test.tsx`

Expected: FAIL，提示 `HomeHeroCarousel` 不存在。

- [ ] **Step 4: 实现轮播状态与暂停条件**

`HomeHeroCarousel` 初始 index 0，`go(delta)` 使用模运算；自动播放 effect 只在未暂停时注册一个 timeout：

```ts
useEffect(() => {
  if (paused || reducedMotion || document.hidden) return;
  const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % slides.length), autoplayMs);
  return () => window.clearTimeout(timer);
}, [activeIndex, autoplayMs, paused, reducedMotion, slides.length, pageVisible]);
```

监听 `visibilitychange` 更新 `pageVisible`。hover 与 focus-within 更新 pause state；用户操作通过 setActiveIndex 自然重置 timeout。

- [ ] **Step 5: 实现按钮、圆点、键盘和 Pointer 手势**

根 section 使用 `role="region" aria-roledescription="carousel" aria-label="光波互联业务轮播" tabIndex={0}`。Pointer 起点保存 `{x,y}`，pointerup 仅在 `absX >= 48 && absX > absY * 1.2` 时切换；不得调用 `preventDefault`。当前 slide 动态渲染一个 H1、正文、内部 Link 与当前 `HomeHeroVisual`。

- [ ] **Step 6: 实现普通 Banner CSS**

移植旧 story 的五种配色与错落布局，但删除 `.steps`、sticky 和 slide 叠层规则。根 section 高度由内容决定，桌面最小高度 `calc(100svh - 5rem)`，手机不超过自然内容高度；交互区 `touch-action: pan-y; overflow: clip;`。控制按钮至少 44×44px，圆点当前态同时使用宽度、边框和颜色区别。reduced-motion 下 transition 为 none。

- [ ] **Step 7: 运行 Task 4 验证**

Run: `pnpm exec vitest run tests/components/home-hero-carousel.test.tsx tests/components/home-hero-story.test.tsx && pnpm typecheck && pnpm exec eslint src/components/marketing/home-hero-carousel.tsx src/components/marketing/home-hero-visual.tsx tests/components/home-hero-carousel.test.tsx && git diff --check`

Expected: 全部 PASS；旧首页仍能在 Task 5 前编译。

- [ ] **Step 8: 提交 Task 4**

```bash
git add src/components/marketing/home-hero-types.ts src/components/marketing/home-hero-carousel.tsx src/components/marketing/home-hero-carousel.module.css src/components/marketing/home-hero-visual.tsx src/components/marketing/home-hero-story.tsx tests/components/home-hero-carousel.test.tsx
git commit -m "feat: add accessible home hero carousel"
```

### Task 5: 首页集成与浏览器验收

**Files:**
- Modify: `src/components/marketing/home-page.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/components/marketing-page.test.tsx`
- Modify: `e2e/public-site.spec.ts`
- Delete: `src/components/marketing/home-hero-story.tsx`
- Delete: `src/components/marketing/home-hero-story.module.css`
- Delete: `tests/components/home-hero-story.test.tsx`

**Interfaces:**
- Consumes: `HomeHeroCarousel`, `ModelEcosystemLoop`。
- Produces: 完整首页与浏览器验收。

- [ ] **Step 1: 先更新首页集成测试并观察失败**

将旧 story step 断言替换为：一个 carousel region、五个命名圆点、初始 AI H1、完整下方 section IDs、Provider/Model 标签和可访问项数量。测试必须断言静态 `.home-models__names` 不再存在。

Run: `pnpm exec vitest run tests/components/marketing-page.test.tsx`

Expected: FAIL，因为首页仍渲染旧 story 与静态模型列表。

- [ ] **Step 2: 切换 HomePage 组装**

删除 `modelNames`，把 `<HomeHeroStory>` 替换为 `<HomeHeroCarousel>`，把 `<ul className="home-models__names">` 替换为 `<ModelEcosystemLoop />`。保留 `model-ecosystem-heading`、标题说明与以下 section 顺序：`ai, idc, madeinchina, network, energy, delivery, about`。

- [ ] **Step 3: 清理旧 story 与全局样式**

删除旧 story 三个文件。`globals.css` 删除 `.home-models__names` 规则，调整 `.home-models__layout` 为标题后双轨全宽；不得删除下方 `DomainVisual` 使用的 `home-orbit-spin`。

- [ ] **Step 4: 更新浏览器测试**

删除 sticky step、反向滚动和 progress 旧断言，新增：

- next/previous、圆点与键盘切换。
- 等待 6500ms 后 AI 自动进入 COMPUTE；hover/focus/reduced-motion 下 6500ms 不切换。
- Pointer 横向 80px 切换，纵向 180px 不切换；随后 `mouse.wheel(0, 600)` 令 `scrollY` 增大。
- 两个 LogoLoop 的 direction/speed/hoverSpeed/CSS variables 精确符合规格。
- 两个可访问首列表分别有 136/72 项，副本不进入可访问树。
- 常规模式 transform 随时间变化且方向相反；hover 后仍移动但位移速率下降；低动态模式 transform 稳定。
- 360、390、768、1280、1440px 无页面横向溢出，120px Logo hover scale 不被上下裁切。
- 首页下方七个原模块与内页回归继续通过。

- [ ] **Step 5: 运行定向验证并修复集成缺陷**

Run: `pnpm exec vitest run tests/components/marketing-page.test.tsx tests/components/home-hero-carousel.test.tsx tests/components/model-ecosystem-loop.test.tsx && pnpm exec playwright test e2e/public-site.spec.ts --grep "home carousel|logo loop|horizontal overflow" --output=/tmp/zhire-carousel-logo-targeted --workers=1`

Expected: 全部 PASS，无 console error。

- [ ] **Step 6: 运行完整验证**

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm exec playwright test --output=/tmp/zhire-carousel-logo-full --workers=1
git diff --check
```

Expected: 全部 PASS；生产构建静态生成 18 个页面。构建若只改写 `next-env.d.ts` 的生成类型路径，恢复该噪音后再检查状态。

- [ ] **Step 7: 提交 Task 5**

```bash
git add -A src/components/marketing/home-page.tsx src/components/marketing/home-hero-story.tsx src/components/marketing/home-hero-story.module.css tests/components/home-hero-story.test.tsx src/app/globals.css tests/components/marketing-page.test.tsx e2e/public-site.spec.ts
git commit -m "feat: integrate home carousel and complete logo ecosystem"
```

### Task 6: 双重审查、最终验证与任务归档

**Files:**
- Modify: `.ccg/tasks/redesign-homepage-zenmux/task.json`
- Modify: `.ccg/tasks/redesign-homepage-zenmux/review.md`
- Move on completion: `.ccg/tasks/redesign-homepage-zenmux/` → `.ccg/tasks/archive/2026-09/redesign-homepage-zenmux/`

- [ ] **Step 1: 对完整变更并行调用外部 reviewer**

使用 antigravity reviewer 检查轮播视觉、移动端、LogoLoop 连续性与交互；使用 Claude reviewer 检查状态清理、目录完整性、性能、可访问性和测试。若 `/Users/naf/.claude/bin/codeagent-wrapper` 仍不可用，记录两个退出码，并并行派发内部工程 reviewer 与 UI reviewer 作为回退。

- [ ] **Step 2: 修复所有 Critical 与 Important**

每个修复添加能复现问题的测试；修复后重新运行所属定向测试并进行一次范围复审。Minor 仅在不扩大范围时修复，否则记录。

- [ ] **Step 3: 运行新鲜完整验证**

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm exec playwright test --output=/tmp/zhire-carousel-logo-release --workers=1
git diff --check
curl -s -o /dev/null -w '%{http_code}\n' --max-time 10 http://localhost:43187/
```

Expected: 单元、类型、Lint、构建、浏览器全部退出 0，本地首页 HTTP 200。

- [ ] **Step 4: 更新审查记录和 Spec Evolution**

`review.md` 写入两个外部/内部审查结果、修复项、测试数量和构建页面数。只有发现可复用的新约定时才更新 `.ccg/spec/frontend/index.md`；否则明确记录不需要演进。

- [ ] **Step 5: 完成并归档 CCG Task**

将 `task.json` 更新为 `status: "completed"`、`currentPhase: "completed"`，移动到 `.ccg/tasks/archive/2026-09/redesign-homepage-zenmux/`，只暂存该归档目录并提交：

```bash
git add -A .ccg/tasks/redesign-homepage-zenmux .ccg/tasks/archive/2026-09/redesign-homepage-zenmux
git commit -m "chore: archive ccg task redesign-homepage-zenmux"
```
