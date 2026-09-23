# 工程架构、HeroUI、SEO 与交付风险研究

调查时间：2026-09-23。范围是前端基础框架与 14 个公开展示路由的研究；本文件没有改动产品代码或安装依赖。

## Files Found

| 文件 | 作用 |
| --- | --- |
| `docs/前端框架新对话交接.md` | 本轮交付范围、技术栈、43187 端口、HeroUI MCP/AGENTS 与验收硬约束。 |
| `docs/前端技术栈与SEO方案.md` | Server/Client 边界、静态预渲染、SEO 和响应式验收口径。 |
| `docs/官网展示页设计方案.md` | 首页模块顺序、五类公开页布局、交互与内容限制。 |
| `docs/首期页面清单与数量.md` | 14 个官网路由；另外 10 个账户/控制台路由属于后续阶段。 |
| `docs/官网展示页开发准备清单.md` | 素材、联系人、域名与部署缺口，以及当前仓库无前端工程的基线。 |
| `docs/网站各板块介绍页文案.md` | 14 页主文案和内部编辑说明；仅“页面正文开始/结束”之间可面向访客。 |
| `profile/logo.png` | 已有 407×111 透明 PNG 品牌标识；用于小尺寸导航。 |

仓库现状：顶层只有 `docs/`、`profile/`、`product/`、`extracted/`、`scripts/`、`tmp/` 和 `.ccg/` 等资料目录；未见 `package.json`、Next.js/React 代码、锁文件、`.ccg/spec/` 或磁盘上的 `AGENTS.md`。`git rev-parse` 返回“not a git repository”。本机 `node v22.22.3`、`pnpm 9.15.4`；43187 当前无监听进程（`lsof` 返回空）。这些是调查时快照，实施前需重查。

## Dependencies

```text
14 个公开路由及首页顺序（页面清单、设计方案）
  -> 每页访客文案与模型生态口径（总文案的正文边界）
  -> 本地结构化内容/路由清单
  -> App Router Server Components + 局部 Client Components
  -> 共享布局/主题/导航/页脚 + HeroUI v3 控件
  -> 每页 metadata/canonical + sitemap/robots + 站内链接
  -> 类型、lint、构建、43187 浏览器和 HTML 验收

HeroUI v3 -> React >=19 + Tailwind >=4 + @heroui/styles
Next.js App Router -> React/React DOM + Node >=20.9
Tailwind v4 for Next -> tailwindcss + @tailwindcss/postcss + postcss
绝对 canonical/sitemap URL -> 已确认的部署域名/站点 origin
有效咨询入口 -> 已确认的电话、邮箱、微信或地址
```

### 版本与安装策略

- 使用 pnpm，先查已发布稳定版和 `peerDependencies`，再安装，提交 `pnpm-lock.yaml`，后续 CI 用 `pnpm install --frozen-lockfile`。调查时 npm 元数据显示 `next@16.3.6` 需要 Node >=20.9，接受 React 19；`react@19.3.0`、`tailwindcss@4.3.3`、`@heroui/react@3.2.6`、`@heroui/styles@3.2.6` 为当时 latest；HeroUI React 声明 React/React DOM >=19、Tailwind >=4，另有 React Aria 系列 peer 依赖。`typescript@latest` 当时已到 7.0.2，应先确认与选定 Next/ESLint/类型包组合兼容，不因 latest 标签盲升。实际安装时重新查询，并以锁文件、peer 检查、构建结果为准。
- HeroUI v3 使用 `@heroui/react` 和 `@heroui/styles`，CSS 中 `@import "tailwindcss"` 在前、`@import "@heroui/styles"` 紧随其后；PostCSS 用 `@tailwindcss/postcss`。v3 不需要 `HeroUIProvider`、`@heroui/theme` 或 Framer Motion 作为基础接入；组件 API 应从实际版本文档取复合结构和属性，不能套 v2 写法。官方 [快速开始](https://heroui.com/docs/react/getting-started/quick-start.mdx) 与本地 `heroui-react` Skill 一致。
- Next App Router 的根 `layout.tsx` 负责 `lang="zh-CN"`、全局 CSS、共享外壳；HeroUI 的导航/弹层等交互放在小型客户端岛。不要把整站布局标记 `use client`，以免所有下游内容进入客户端依赖图。官方 [Server/Client 说明](https://nextjs.org/docs/app/getting-started/server-and-client-components) 明确页面/布局默认是 Server Component，Client Component 也会参与首次 HTML 预渲染。
- 本阶段保持 Next 常规构建能力，静态生成公开页；不要仅因公开内容静态就设置 `output: "export"`。后续控制台可能需要服务端认证与动态能力；[静态导出限制](https://nextjs.org/docs/app/guides/static-exports)应在部署方式确认时再评估。

### 内容模型与页面结构

建议用一个 typed route manifest 维护 `path`、`navLabel`、`title`、`description`、`section`、`relatedPaths` 与正文数据的关联；导航、页脚、面包屑、metadata 和 sitemap 都从同一清单取路径，避免 14 份手写列表漂移。正文可分为 hero、能力/服务项、场景、选型维度、流程、相关链接等结构化 section，业务布局按首页、总览、模型分类、基础设施/方案、公司五类组合。静态内容不要额外引入 CMS/数据库。

主文案并非可原样全部上站：`docs/网站各板块介绍页文案.md:5` 和 `:746` 将正文与内部编辑说明分开。首页正文里的“查看可用模型与价格”、AI 总览的控制台描述需根据 `:775` 的发布条件暂缓展示；可以保留真实模型生态介绍和“咨询接入”路径。39 个分类条目不等于本站 39 个可调用型号；不要把合作资源的资质、资产、案例写成光波互联自有。联系方式、可售规格和实时报价都尚未确认。

### 14 路由、metadata 与抓取

首期仅以下公开路由，顺序与页面清单一致：

| 组 | 路由 |
| --- | --- |
| 首页 | `/` |
| 大模型 | `/ai`、`/ai/llm`、`/ai/image`、`/ai/video` |
| IDC | `/idc`、`/idc/vps`、`/idc/bare-metal`、`/idc/colocation`、`/idc/gpu` |
| 其他业务与公司 | `/madeinchina`、`/network`、`/energy`、`/about` |

每个路由至少输出唯一中文 `title`、`description`、canonical、Open Graph/Twitter 标题描述，页面本体有一条主 `h1`、语义化分节、可抓取的真实 `<a href>` 内链。共享 `metadataBase` 应来自明确的站点 origin；Next 的相对 canonical/OG URL 在缺少 `metadataBase` 时会构建报错。[generateMetadata 文档](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)给出了绝对地址组合规则。当前域名未定，本地可用显式开发 origin 验证；正式构建/发布必须换成已确认域名，不能把 `localhost` 或示例域名发布为 canonical。不要编造 OG 图片；图片素材确认后补分享图。

`app/sitemap.ts` 只列这 14 个可索引公开页，使用与 canonical 同一个 origin；`app/robots.ts` 指向 sitemap，正式环境开放公开页，预览/测试环境应 `noindex`/禁止索引，并在上线时恢复。404 不入站点地图；未来 `/login` 和 `/console` 等账户页设 noindex，且认证仍须由服务端保障，robots 不能代替鉴权。组织及面包屑结构化数据只填可证实字段。参考 Next 的 [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)、[robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) 文件约定。

### 43187 与验收

开发脚本显式使用 `next dev -p 43187`（若验收生产服务，也显式 `next start -p 43187`）；不要静默切到其他端口。启动前或冲突时用 `lsof -nP -iTCP:43187 -sTCP:LISTEN` 识别占用，报告并停止本次启动，不终止别的进程。Next 官方 [CLI 文档](https://nextjs.org/docs/app/api-reference/cli/next)支持 `-p/--port`。

建议最小交付门槛：`pnpm exec tsc --noEmit`、项目配置的 ESLint 命令（Next 16 不应默认假定 `next lint` 可用）、`pnpm build`；若有针对路由/内容清单的测试，运行之。再启动 43187，逐条检查 14 路由 HTTP 200 与非占位正文，`/sitemap.xml`/`/robots.txt`、canonical/title、404、导航和 CTA 去向；抓取初始 HTML 确认主标题和关键正文已在其中。浏览器验证 320、375/390、768、1024、1440 CSS 像素，至少桌面和手机实测导航展开、键盘焦点、无横向溢出、图片与链接。iOS Safari/Android Chrome 若没有实机，记录模拟器验收的局限。不要把浏览器运行成功当作生产构建成功，两者单独留证。

### MCP 与 AGENTS.md

当前会话可用工具清单中没有 HeroUI MCP；调查了 `~/.codex/config.toml`、`~/.claude/settings.json`、`~/.claude.json` 的 MCP 名称、项目下常见 `.mcp.json`/`.codex/config.toml` 位置，未发现 `heroui-react` 条目。此结论只覆盖这些位置与当前会话，不等于全机不存在缓存/其他客户端配置。官方 [HeroUI MCP 文档](https://heroui.com/en/docs/react/getting-started/mcp-server)给 Codex 的配置为 `[mcp_servers.heroui-react]`、`command = "npx"`、`args = ["-y", "@heroui/react-mcp@latest"]`；它要求 Node 22+，本机满足。接入后需重启相应客户端，实际调用 `list_components` 与 `get_component_docs` 证明可用；若没有暴露，官方 MDX/本地 Skill 脚本仍可用于查证组件 API，但不能报告 MCP 已验证。

HeroUI 官方 [AGENTS.md Preview](https://heroui.com/en/docs/react/getting-started/agents-md)说明 `agents-md --react` 专供 v3，其他 CLI `init/add/upgrade` 目前仍可能走 v2。执行时应先输出到独立 `HEROUI_REFERENCE.md`，检查它下载的 `.heroui-docs/react/`、生成索引及 `.gitignore` 副作用，再把必要索引合并到项目约定；用户给出的 CCG 管理块和规则必须保留。当前磁盘无 `AGENTS.md`，但会话中的 CCG 指令仍然有效，不应直接用 CLI 输出覆盖。文档版本要与锁定的 HeroUI 版本核对，避免使用 latest 文档描述旧安装包。

## Patterns

- `docs/前端框架新对话交接.md:12-14`：静态/服务端公开内容、独立 SEO 元信息、局部客户端交互、14 路由骨架及 43187 验收是本轮主线。
- `docs/前端技术栈与SEO方案.md:9-12`：公开页预渲染，后续控制台使用独立布局；SSG 不等于整站静态导出。
- `docs/官网展示页设计方案.md:18-42`：首页大模型先行；总览、模型分类、产品方案、公司页复用布局；导航与 CTA 只指向真实页面/联系区。
- `docs/首期页面清单与数量.md:7-25`：14 个公开路由的路径清单；`:28-42` 的 10 个账户/控制台页是后续范围。
- `docs/网站各板块介绍页文案.md:36-95`：首页真实正文；`:101-338` 是 AI 四页；`:344-557` 是 IDC 五页；`:563-744` 是其他四页；`:746-784` 是不上站的编辑说明。
- `docs/官网展示页开发准备清单.md:11-27`：联系人、域名、图片和可售型号/价格尚未确认，决定咨询入口、绝对 SEO URL、素材和数据展示的边界。

## Risks

1. **范围漂移**：文案中的控制台、实时模型价格、API Key、充值、在线生成语句不能由本次静态介绍页兑现。路由只建 14 条公开页，避免空控制台入口与假表单。
2. **SEO URL 错误**：域名未定时如果把 localhost/示例域名写死进 canonical、OG 或 sitemap，正式发布会产生错误索引信号；发布前必须以真实 origin 重构建并检查输出。
3. **版本错配**：HeroUI v2/v3 API 与主题配置差异大；React Aria peer、Next/TypeScript 最新大版本、Tailwind 4 PostCSS 组合必须在安装时检查并锁定。仅凭 `latest` 标记不构成兼容验证。
4. **客户端边界过宽**：把共享 layout 或整页设 `use client` 会扩大浏览器脚本与内容依赖；核心正文必须出现在初始 HTML，互动导航独立封装。
5. **素材与主张**：提取图片可能带第三方标识或整页 PPT；模型列表是生态介绍，IDC/能源等服务是合作对接，不可作为自有资产或实时可用库存宣传。
6. **联系与发布缺口**：目前电话/邮箱/微信、对外地址和部署域名未确认。`/about#contact` 可作页面内部锚点，但不得展示空联系卡、无效按钮或假成功提交。
7. **仓库交付闭环**：当前不是 Git 仓库，用户给出的 CCG 归档后 Git 提交要求在现状下无法直接执行；主会话需在交付策略中处理这一事实，且不要因为缺 Git 跳过构建/浏览器验收。

官方核对来源：HeroUI [快速开始](https://heroui.com/docs/react/getting-started/quick-start.mdx)、[MCP](https://heroui.com/en/docs/react/getting-started/mcp-server)、[AGENTS](https://heroui.com/en/docs/react/getting-started/agents-md)；Next.js [安装要求](https://nextjs.org/docs/app/getting-started/installation)、[Server/Client](https://nextjs.org/docs/app/getting-started/server-and-client-components)、[Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)、[sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)、[robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)；Tailwind [Next.js 安装](https://tailwindcss.com/docs/installation/framework-guides/nextjs)。npm 版本号来自 2026-09-23 的只读 `npm view` 查询。
