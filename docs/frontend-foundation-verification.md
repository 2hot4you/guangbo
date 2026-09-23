# Frontend foundation verification

Verified on 2026-09-23 (Asia/Shanghai), locally at `http://localhost:43187` with installed stable Google Chrome. `NEXT_PUBLIC_SITE_URL` was not configured. The complete chain below was rerun after the 1280px navigation breakpoint adjustment.

## Fresh verification chain

The following commands ran in this order after the browser acceptance suite and test-runner integration were corrected:

| Command | Exit | Evidence |
| --- | ---: | --- |
| `pnpm verify:heroui` | 0 | MCP server exposed 6 tools; component list and Button documentation returned content. |
| `pnpm test` | 0 | 7 test files passed; 64 unit/component tests passed. |
| `pnpm typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `pnpm lint` | 0 | `eslint .` reported no errors. |
| `pnpm build` | 0 | Next.js compiled, completed TypeScript, and generated 18 static pages, including all 14 public routes plus metadata routes and 404. |
| `pnpm test:e2e` | 0 | 44 Playwright tests passed across `desktop-chromium` and `mobile-chromium` (22 per project). |

## Browser acceptance scope

- All 14 exact public paths returned HTTP 200, had exactly one visible H1, and had no document-level horizontal overflow on both configured projects: `/`, `/ai`, `/ai/llm`, `/ai/image`, `/ai/video`, `/idc`, `/idc/vps`, `/idc/bare-metal`, `/idc/colocation`, `/idc/gpu`, `/madeinchina`, `/network`, `/energy`, `/about`.
- `/`, `/ai/llm`, `/idc/colocation`, `/network`, `/energy`, and `/about` were exercised at each of 320, 375, 390, 768, 1024, and 1440 CSS px on both projects: 72 sampled page/viewport combinations. The suite checked the header transition (mobile opener at 1024px, desktop menu at 1440px), loaded logo, cards, footer, topology bounds, and horizontal overflow. All 14 routes were also checked at each project's default representative viewport.
- Mobile navigation exposed separate AI and IDC overview links and expandable child lists; selecting the IDC colocation child changed route and closed the drawer. Desktop dropdown opened through keyboard input, showed `:focus-visible` on its trigger, moved focus with ArrowDown, and navigated on Enter.
- `/missing-page` returned HTTP 404 with H1 `页面未找到`. `/sitemap.xml` contained exactly the 14 public paths. With no configured real origin, `/robots.txt` allowed crawling and omitted `Sitemap:`, while sampled public HTML contained `noindex, nofollow` so the directive remains observable to crawlers.
- Initial response HTML contained H1 and lead text for home, network, and about before hydration. The action audit found no `/console`, auth, payment, fake pricing, or online-generation link or action on any public route.

## Visual check and limits

Viewport screenshots were inspected for home at 320, LLM at 375, colocation at 390, network at 768, energy at 1024, and about at 1440 CSS px. The 320px LLM model-series cards, network topology, and footer were inspected separately. No clipping or missing logo was observed. The first 1024px screenshot showed cramped, wrapping desktop navigation; after the breakpoint adjustment, a fresh 1024px screenshot showed the compact mobile header without that wrapping.

Mobile and desktop checks use Chrome with Playwright viewport/device emulation. No real iOS Safari or Android Chrome device was used. The hosted production origin and its indexable robots/canonical behavior were not exercised; this run intentionally verified the unconfigured-origin safeguards. Development screenshots include Next.js's development overlay badge, which is not part of the production build.

Non-failing tool warnings included Vite's future native config-loader compatibility notice, Next.js ignoring a parent-directory `package-lock.json` outside this repository, and Next.js's smooth-scroll route-transition notice.
