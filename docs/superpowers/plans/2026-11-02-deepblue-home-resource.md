# DeepBlue Server 首页资源卡实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 清除 DeepBlue 资源对外页面中的内部货号，并在首页 COMPUTE 区域展示与详情页同源的精简资源信息。

**Architecture:** `bareMetalResources` 继续作为资源名称、配置、简介、价格、联系方式和限定语的唯一来源。`HomePage` 保持服务端渲染，在 IDC 右栏的服务列表之后渲染一张紧凑 `article`，详情页继续使用完整资源卡。

**Tech Stack:** React 19、Next.js 16 App Router、TypeScript、Tailwind CSS 4 全局样式、Vitest、Testing Library、Playwright

**Spec:** `.ccg/tasks/promote-deepblue-server-homepage/requirements.md`

## Global Constraints

- 公开名称必须为 `DeepBlue Server`，公开 HTML 不得出现 `bz-4002`。
- 首页与详情页不得复制维护配置、价格或电话号码。
- 首页保留“参考价”和实际确认限定语，不形成库存或固定价格承诺。
- 不增加客户端状态；资源卡保持服务端渲染。
- 不改变现有首页七个 section 的顺序或业务动效。

## Review Focus

- 内部货号可能从 DOM `id`、ARIA 属性或 RSC 数据中泄漏：测试两条页面的完整服务端 HTML。
- 首页和详情页数据口径漂移：两处均从 `bareMetalResources[0]` 消费。
- 长处理器、存储和手机号导致移动端横向溢出：卡片内容允许换行并做 390px 浏览器检查。
- 精简展示误删价格限定：保留“参考价”和资源 notice。
- 新链接破坏内部链接审计：详情入口使用现有 `/idc/bare-metal` 路径。

---

### Task 1: 锁定公开名称与首页资源摘要行为

**Files:**
- Modify: `tests/components/marketing-page.test.tsx`
- Modify: `e2e/public-site.spec.ts`

**Interfaces:**
- Consumes: `MarketingPageView`、`bareMetalResources`
- Produces: 详情页和首页资源输出的回归约束

- [ ] **Step 1: 写失败测试**

将详情页期望名称改为 `DeepBlue Server`，并断言详情页和首页服务端 HTML 都不包含 `bz-4002`。在首页 `#idc` 中断言精简资源 `article` 包含核心配置、简述、两档参考价、两个号码、限定语和 `/idc/bare-metal` 详情入口。

- [ ] **Step 2: 验证测试按预期失败**

Run: `pnpm test tests/components/marketing-page.test.tsx`
Expected: FAIL，当前仍输出旧名称且首页没有资源摘要卡。

### Task 2: 统一资源数据并实现首页卡片

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/resources/bare-metal.ts`
- Modify: `src/components/marketing/home-page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `bareMetalResources: readonly ResourceCard[]`
- Produces: `ResourceCard.summary` 和首页 `.home-idc__resource` 服务端卡片

- [ ] **Step 1: 更新共享资源数据**

将资源 `id` 改为不含货号的中性值、`name` 改为 `DeepBlue Server`，新增精简 `summary`；完整配置、价格、联系方式和限定语保持共享数据源。

- [ ] **Step 2: 实现首页服务端资源卡**

把 IDC 右栏包成 `.home-idc__content`，在 `ServiceList` 后渲染资源 `article`。按标签从共享 `specifications` 中选取处理器、GPU、内存和存储，使用共享 `summary`、`pricing`、`contacts`、`notice`，并链接到 `/idc/bare-metal`。

- [ ] **Step 3: 增加响应式样式**

为首页资源卡添加命名空间样式；桌面端保持现有两栏结构，卡片内部规格为紧凑网格，移动端改为单列并允许长文本换行。

- [ ] **Step 4: 验证组件测试转绿**

Run: `pnpm test tests/components/marketing-page.test.tsx`
Expected: PASS。

### Task 3: 完整验证与审查

**Files:**
- Modify: `.ccg/tasks/promote-deepblue-server-homepage/review.md`

**Interfaces:**
- Consumes: 最终代码与测试结果
- Produces: CCG 审查和交付证据

- [ ] **Step 1: 运行全量验证**

Run: `pnpm verify`
Expected: 所有测试、类型检查、Lint 和生产构建通过。

- [ ] **Step 2: 运行浏览器检查**

在首页和 `/idc/bare-metal` 的桌面及手机视口核对名称、卡片、详情入口和无横向溢出。

- [ ] **Step 3: 双模型审查**

审查 `git diff` 的正确性、公开信息、响应式、可访问性和范围；Critical 必须修复后重审。

- [ ] **Step 4: 提交并归档**

仅提交本任务文件并归档 CCG task。推送和线上部署属于外部变更，等待用户明确要求后再执行。
