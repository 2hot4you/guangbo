# UI、测试与上线分析

本报告基于实施前代码和已有发布记录。以下验收项目待在实现后执行。

## 文件、依赖和现有模式

- 首页直接从 `src/content/resources/bare-metal.ts` 读取目录；`src/components/marketing/home-page.tsx:58-91,150-161` 的文章、价格、详情 CTA 均使用资源对象，最终只渲染下标 0。
- 详情页通过 `src/content/pages/idc.ts:89` 的 `resourceCards`、`src/components/marketing/solution-page.tsx:26-31` 和 `bare-metal-resource-cards.tsx:5-44` 渲染数组，每项已有独立具名 article、标题和规格列表。详情不输出 summary，仅放入 summary 的地域或商业条款会丢失。
- `src/app/globals.css:160-191,280-301,342-366` 已提供桌面侧标题和卡片栈、窄屏自然整列、宽屏卡内双列规格。右侧栏在 56rem 起最窄可为 28rem，不宜将三张摘要卡并排放入该栏。
- `tests/components/marketing-page.test.tsx:199-296` 有单商品假设、独立卡 fixture 和 DeepBlue 摘要契约。`e2e/public-site.spec.ts:90-120,558-589` 涵盖全页宽度、SSR 和深色链接键盘焦点。

## Critical

- 仅追加目录数据会使首页仍只有 DeepBlue；只改循环又会使首页筛选标签丢失新机型网络和台数。用同一数组按 ID 映射卡片，保留 DeepBlue 的存储、价格、联系方式和旧摘要行为，明确标出新资源的 CPU、GPU、内存、网络、128 台及定价口径。
- 独立核对 H200 的五年周期、议价及每台月价，5090 的西南区域、约一个月和两档包项；不可把 DeepBlue 联系方式、其他卡的条款或未提供的区域带入新卡。详情兼顾两种报价形态和完整参数。

## Warning

- `home-page.tsx:86`、`bare-metal-resource-cards.tsx:34-42` 固定渲染咨询及适用任务区。没有获授权数据的可选项只在有内容时渲染。40rem 起，唯一的 CTA、notice、价格行或 details 子节仍受多列模板约束；按实际内容让单项占满整行。现有 footer 的 first/last-child 样式也需核对。实际对比 640px 断点、长价格标签、长 SKU 以及 CTA 的换行和视觉裁切。
- 两种卡均 `overflow: hidden`；仅查 document.scrollWidth 无法捕获内部裁切。E2E 对两个目标路由使用专门的卡片内矩形、scrollWidth 检查，带断言确认选中了三张。现有 sampledPaths 的全局 footer 可见性断言假设唯一，详情每张卡还有语义 footer，不宜直接追加该路径复用。
- 现有详情测试假设一张，首页测试要求 DeepBlue 不含网络全文且 CTA 指向页面。用实际产品的具名 article 限定断言；各自核对关键参数、独有条款，以及无空咨询或其他型号的价格。首页 SSR/公网验证用可见文档元素，不以 Next 内联脚本包含商品名作为渲染证明。
- 详情入口若采用每商品 fragment，应有唯一 ID，核对固定头部下滚动位置及键盘操作，按需添加 scroll-margin。保持现有 CTA 可辨识的资源名称；采用页级链接亦可满足原有入口契约。

## Info 和建议文件范围

- 使用现有服务端组件与 article/h3/dl/h4、具名可聚焦 CTA。纯文本增量无需新图、客户端状态、轮播或数据请求；用四项左右关键配置和简短摘要控制首页高度，保留自然阅读顺序。
- 涉及目录数据、必要的资源类型、首页组件、详情组件以及两处测试。对现有样式的改动限于卡内布局。若联系方式或适用任务变为可选，可相应调整 `src/content/pages/idc.ts:89` 的分区说明。
- 参考 `.ccg/tasks/archive/2026-11/push-deploy-deepblue-homepage/review.md` 的校验方式；历史目标 SHA 和镜像不是本次现网状态，发布前应重新读取。

## 验收清单

- [ ] 单测两页各有 3 张唯一具名 article，DeepBlue 旧配置不变，H200 与 5090 的规格、报价、限定语、库存口径严格归属本卡。
- [ ] 两页 HTTP 200，实际服务端文章 DOM 可无 JS 读取；首页每张卡有资源名称明确的详情链接，详情字段齐全。保留既有 SKU 泄漏回归测试。
- [ ] 在 360、768、1280、1440px 实测两页 article、标题、规格、价格、CTA 无横溢和裁切；验证 640/896px 断点若有特殊布局。键盘 Tab 到 CTA 有可见轮廓；触达并读到对应详情。
- [ ] 依 `.ccg/spec/frontend/index.md` 分时运行 dev 与 build；完整 `pnpm verify`、`pnpm test:e2e` 通过，端口上服务与当前构建一致。
- [ ] 记录推送 SHA 与构建来源，核对旧镜像 ID 和 Compose 备份校验值。验证新容器 healthy、实际镜像 ID、宿主机只绑定 127.0.0.1:43187、公网两页实际输出及既有 DeepBlue、canonical、robots 和 sitemap；留存回滚操作依据。
