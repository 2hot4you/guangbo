# 首页普通轮播与完整模型生态 LogoLoop 设计

## 背景与目标

首页当前使用五业务长距离 sticky 滚动故事。用户要求将首屏收回为普通轮播 Banner，并将 `#model-ecosystem` 中的静态模型名称列表替换为 React Bits `LogoLoop`。LogoLoop 必须覆盖 LobeHub Icons 当前固定版本中 Provider 与 Model 两个分类的完整目录。

目标：

- 首页首屏保持 AI、COMPUTE、XINCHUANG、LINK、ENERGY 五组内容，但不再占用多屏滚动距离。
- 轮播自动播放，也能通过按钮、圆点、键盘和横向触控手势操作。
- 页面纵向滚动始终由浏览器原生处理，不注册 wheel 拦截。
- 模型生态以两条连续 Logo 轨道展示完整 Provider 与 Model 目录。
- 保留首页首屏以下全部业务内容、内部链接、语义结构和现有视觉语言。

## 范围定义

### LobeHub 完整目录

- 固定依赖版本为 `@lobehub/icons@5.21.0`。
- 以该版本官方 `skills.md` 中 `Model` 与 `Provider` 分类为准。
- 当前规格基线为 72 个 Model 与 136 个 Provider，共 208 个目录项。
- 同一个品牌若同时属于 Model 与 Provider，允许分别出现在两条轨道中。
- 不包含 `Application` 分类。
- 目录以 checked-in TypeScript manifest 保存；同步脚本仅在维护时运行，生产构建不依赖外网。

### 非目标

- 不增加模型价格、库存、在线购买或在线调用能力。
- 不为每个 Logo 增加外部跳转链接。
- 不删除或折叠首页下方现有完整业务模块。
- 不引入额外轮播、手势或动画第三方库。

## 普通轮播 Banner

### 结构

新增 `HomeHeroCarousel` 客户端组件，替换 `HomeHeroStory` 的 sticky steps 和 IntersectionObserver。组件继续消费现有五条 `HomeHeroSlideContent` 数据，并复用 `HomeHeroVisual` 的五种圆形视觉。

轮播区域包含：

1. 当前业务内容：编号、领域标签、标题、说明和内部 CTA。
2. 当前业务圆形视觉。
3. 上一张与下一张按钮。
4. 五个圆点按钮，名称包含业务领域。
5. 非打扰式状态文本，用于用户主动切换后的辅助技术反馈。

只渲染当前业务内容，首页保持一个 H1。首屏以下业务模块仍提供其他四个业务方向的完整服务端内容，因此不依赖轮播承载整页 SEO 文案。

### 自动播放

- 默认间隔 6000ms。
- 到最后一张后回到第一张。
- 鼠标进入、焦点位于轮播内部、浏览器标签不可见时暂停。
- 用户按钮、圆点、键盘或滑动操作后重新计算下一次自动切换时间。
- `prefers-reduced-motion: reduce` 下不启动自动播放。

### 控制与手势

- 左右按钮循环切换。
- 圆点使用真实 `button`，当前项使用 `aria-current="true"`。
- 轮播获得焦点时响应 `ArrowLeft` 与 `ArrowRight`。
- Pointer 手势记录起点和终点；只有横向位移超过 48px 且明显大于纵向位移时切换。
- 触控区域设置 `touch-action: pan-y`，不调用 `preventDefault()`，不注册 `wheel` 监听器；纵向手势继续滚动页面。

### 动画与无障碍

- 常规模式使用短距离位移和透明度过渡。
- `prefers-reduced-motion` 下取消 slide transition，停用自动播放，圆形视觉也继续遵守现有低动态规则。
- 根元素使用 `role="region"`、`aria-roledescription="carousel"` 和明确中文标签。
- 当前内容保留真实内部链接；切换不会强制移动焦点。
- 控件满足至少 44×44px 点击区域。

## 完整 Provider / Model LogoLoop

### 数据与资源

新增目录 manifest，字段固定为：

```ts
interface LobeCatalogItem {
  id: string;
  name: string;
  category: "provider" | "model";
}
```

同步脚本从 LobeHub 官方目录生成并按分类、名称稳定排序，写入 manifest；测试锁定 136/72 的基线数量、唯一 ID 和分类边界。版本升级时显式重新同步并审查差异。

图标 URL 使用官方 `getLobeIconCDN(id, {cdn: "unpkg", format: "svg", type: "color"})` 生成。所有图片声明固定宽高并使用懒加载，避免累计布局位移。加载失败时隐藏破损图片但保留名称。

### LogoLoop 组件

基于用户提供的 React Bits JavaScript + CSS 源码创建 TypeScript 版本：

- 保留 ResizeObserver、按轨道尺寸补副本、速度缓动、边缘渐隐和 hover 速度。
- Provider 轨道向左，Model 轨道向右。
- Provider 轨道固定 `direction="left"`，Model 轨道固定 `direction="right"`。
- 两条轨道均固定 `speed={160}`、`hoverSpeed={80}`、`logoHeight={120}`、`gap={80}`。
- 两条轨道均开启 `fadeOut` 与 `scaleOnHover`，渐隐颜色匹配模型生态区的深色背景。
- 鼠标悬停和 focus-within 时从 160px/s 平滑减速到 80px/s；离开后恢复 160px/s。
- 第一份列表进入可访问树，重复副本 `aria-hidden="true"`。
- 每项显示图标和文字名称，不生成数百个外部链接。
- `prefers-reduced-motion` 下停止 requestAnimationFrame，而不只是视觉上覆盖 transform；原始顺序列表保持可横向滚动。
- Logo 图片失败不会阻止轨道尺寸计算或其他图标运行。

### 模型生态版式

保留深色 `home-models` 区域、`model-ecosystem-heading` 和现有说明。标题区下方改为：

- `PROVIDERS / 136` 标签及 Provider LogoLoop。
- `MODELS / 72` 标签及 Model LogoLoop。

轨道不使用卡片墙；单项为透明背景的 Logo + 名称组合，使用分隔线和留白维持现有 ZenMux 风格。两端使用深色背景匹配的 fade-out 渐隐。Logo 高度和相邻间距在所有视口保持用户指定的 120px / 80px，外层容器负责裁切，页面不得产生横向溢出。

## 组件边界

- `home-hero-carousel.tsx`：轮播状态、自动播放、暂停、键盘和手势。
- `home-hero-carousel.module.css`：五种背景/布局、控件、过渡和响应式规则。
- `home-hero-visual.tsx`：继续提供五种圆形视觉，不承担轮播状态。
- `logo-loop.tsx` / `logo-loop.module.css`：通用 React Bits 循环组件。
- `model-ecosystem-loop.tsx`：目录到 LogoLoop item 的转换、图片失败回退和两条轨道配置。
- `lobe-icon-catalog.ts`：固定版本完整目录。
- `sync-lobe-icon-catalog.mjs`：维护时同步目录，不参与生产运行。
- `home-page.tsx`：组装五张 Banner 和模型生态区，不管理客户端行为。

## 测试与验收

### 组件测试

- 初始 Banner 显示 AI，只有一个 H1。
- 左右按钮、圆点、键盘均按预期切换且不移动焦点。
- 自动播放按 6000ms 前进；hover、focus、hidden 和 reduced-motion 暂停。
- 横向 Pointer 手势切换；纵向手势不切换且没有 `preventDefault`。
- LogoLoop 的第一份列表可访问，副本隐藏；reduced-motion 不启动 RAF。
- 目录 manifest 精确包含 136 Provider 和 72 Model，ID 唯一，不含 Application。

### 浏览器验收

- 桌面与移动端自动轮播、按钮、圆点和横向滑动正常。
- 真实纵向触控/指针拖动仍能滚动页面。
- 两条 LogoLoop 连续无跳变，hover/focus 减速，低动态模式静止。
- Provider 实测向左、Model 实测向右；常规速度为 160px/s，hover/focus 速度为 80px/s，Logo 高度为 120px、间距为 80px。
- 两条轨道均存在两端 fade-out，支持 hover scale，且放大后不被轨道容器裁切。
- 图标失败时名称仍可见，没有控制台错误和水平页面溢出。
- 首页下方 `ai/idc/madeinchina/network/energy/delivery/about` 全部保留。
- 完整执行单元测试、类型检查、Lint、生产构建与 Playwright。

## 风险与控制

- **首屏资源量：** 不直接导入 208 个 SVG React 组件；改用 CDN 图片、固定尺寸和懒加载。
- **外网失败：** manifest 与文字名称本地保存，图片失败时仍可理解目录内容。
- **DOM 数量：** 完整序列通常宽于视口，LogoLoop 只需最小两份副本；不额外复制隐藏目录。
- **目录漂移：** 锁定包版本和数量测试，升级时显式同步。
- **手势冲突：** 只判断明确横向手势，`touch-action: pan-y` 保留纵向滚动。
- **自动播放可访问性：** 提供暂停条件和低动态关闭，不让自动切换强制抢焦点。
