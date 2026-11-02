# 计算与托管文案和3090裸金属资源实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 移除 IDC“计算与托管”三个入口中的“全国”表述，并把用户提供的 RTX 3090 双卡裸金属资源完整、可核对地加入裸金属内页。

**Architecture:** 继续以 `routeEntries` 作为导航和 SEO 标题的唯一来源，不修改路由地址或导航组件。裸金属资源沿用现有 `MarketingPage` 内容模型，在 `/idc/bare-metal` 增加一个结构化内容模块，用多张卡片分别承载配置、存储网络、价格和适用场景。

**Tech Stack:** Next.js 16.3.6、React 19、TypeScript、Vitest、Playwright

**Spec:** `.ccg/tasks/refine-compute-copy-add-3090-resource/requirements.md`

## Global Constraints

- 仅移除 IDC“计算与托管”中的“全国”，保留“全国专线租赁”等其他业务名称。
- 不修改 `/idc/vps`、`/idc/bare-metal`、`/idc/colocation` 路由。
- 页面公开两个咨询手机号，并将文档价格标为参考价。
- 库存、价格、端口和开通条件必须注明以实际确认为准。
- 公共页面内容保持服务端渲染，不引入新的客户端状态。

## Review Focus

- 导航名称、页面标题和社交 metadata 应从同一条路由数据派生，避免只改可见菜单。
- “全国专线租赁”不得被此次批量替换误伤。
- 资源规格中的 CPU 核心线程、GPU 数量、内存、存储和网络端口须与源文档一致。
- 价格必须作为参考信息呈现，不能形成库存或交付承诺。
- 两个手机号应在服务端 HTML 中可见，并保持为纯文本而非未经确认的交互入口。

---

### Task 1: 收紧计算与托管名称

**Files:**
- Modify: `src/content/routes.ts`
- Test: `tests/content/routes.test.ts`
- Test: `e2e/public-site.spec.ts`

**Interfaces:**
- Consumes: `routeEntries`、`getRouteByPath()`、由路由数据派生的导航与 metadata。
- Produces: 三个不含“全国”的 IDC 子页面名称，保留原有路径与其他业务名称。

- [ ] **Step 1: 写失败测试**

在 `tests/content/routes.test.ts` 精确断言三个 IDC 子页面的 `navLabel` 和 `title`，并断言 `/network` 仍为“全国专线租赁”。同步更新 E2E 中三个旧名称的期望值。

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest run tests/content/routes.test.ts`
Expected: FAIL，三个 IDC 名称仍包含“全国”。

- [ ] **Step 3: 更新路由文案**

在 `src/content/routes.ts` 将三组名称改为“VPS租赁”“裸金属服务器租赁”“机房机柜租赁”，对应标题以“｜光波互联”结尾。

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest run tests/content/routes.test.ts`
Expected: PASS。

### Task 2: 加入 RTX 3090 双卡裸金属资源

**Files:**
- Modify: `src/content/pages/idc.ts`
- Test: `tests/components/marketing-page.test.tsx`

**Interfaces:**
- Consumes: 现有 `MarketingPage.sections`、`ContentSection.items`、`ContentCard` 服务端渲染。
- Produces: `/idc/bare-metal#available-resource` 内容模块，包含资源规格、价格、联系方式和交付限定语。

- [ ] **Step 1: 写失败测试**

在 `tests/components/marketing-page.test.tsx` 渲染 `/idc/bare-metal`，断言 DeepBlue bz-4002、双路 Xeon Gold 6133、RTX 3090 × 2、512 GB DDR4、两类存储、1GbE/10GbE 端口、CentOS 7.9 / Edgeray IaaS、参考价格、适用场景、两个手机号及“以实际确认为准”限定语均存在于服务端内容。

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest run tests/components/marketing-page.test.tsx`
Expected: FAIL，裸金属页尚无资源模块。

- [ ] **Step 3: 增加资源模块**

在 `idcBareMetal.sections` 中增加 `available-resource`，使用四个 `ContentItem` 分别组织核心配置、存储与网络、参考租赁价格、适用任务与咨询方式；资源标题和页面正文不作库存承诺。

- [ ] **Step 4: 运行相关测试**

Run: `pnpm vitest run tests/components/marketing-page.test.tsx tests/content/routes.test.ts`
Expected: PASS。

- [ ] **Step 5: 运行完整验证**

Run: `pnpm verify`
Expected: 测试、类型检查、Lint 和生产构建全部通过。
