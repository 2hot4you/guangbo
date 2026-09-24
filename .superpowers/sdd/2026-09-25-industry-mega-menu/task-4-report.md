# Task 4 — browser acceptance report

## RED

- Before editing, ran `pnpm exec playwright test e2e/public-site.spec.ts --grep 'responds with one visible H1 and fits the project viewport|desktop navigation uses direct links' --project desktop-chromium --reporter=line`: **4 failed, 11 passed**.
- `/madeinchina`, `/network`, and `/energy` each rendered 13 `data-content-module` sections while the legacy assertion expected 9. The desktop navigation rendered 5 expansion buttons while the legacy assertion expected none. These failures reflected the approved feature changes.

## GREEN

- Migrated module count assertions to expect 13 for the three industry hubs and 9 for the other top-level landing pages. Migrated the desktop navigation assertion to expect five expansion buttons while retaining the direct overview-link and keyboard-focus checks.
- Targeted `pnpm exec playwright test e2e/public-site.spec.ts --grep 'mega menu|industry hubs' --reporter=line`: **14 passed / 14** across desktop and mobile Chromium projects.
- Complete `pnpm test:e2e -- --reporter=line`: **100 passed / 100** across both projects.
- `pnpm typecheck`, `pnpm exec eslint e2e/public-site.spec.ts`, and `git diff --check`: **passed**.

## Browser coverage

- At 1440px, the open desktop panel starts within 1px of the left viewport edge, spans the viewport within 1px, and remains open when the pointer moves from its trigger to a child link for longer than the 180ms leave delay.
- Keyboard Tab reaches a child link; Escape hides the panel, removes child links from the accessible tree, and restores focus to its expansion button.
- A real `tap()` in a `hasTouch: true` 1440px context opens the desktop panel on the first tap and closes it on the second.
- The mobile Drawer exposes overview links and expandable child groups for all five industries, and Escape closes it.
- Desktop cross-route `/network#otn`, mobile cross-route `/energy#solar`, and mobile same-route `/energy#storage` links land on focused sections below the sticky header; Drawer closes after navigation.
- Each of the three industry pages renders one hero and twelve body modules, with no document overflow at 390px or 1280px. Existing viewport coverage also checks 360px, 768px, 1280px, and 1440px.
- Server-rendered header HTML includes AI detail hrefs (`/ai/llm`, `/ai/image`, `/ai/video`) and IDC detail hrefs (`/idc/vps`, `/idc/bare-metal`, `/idc/colocation`, `/idc/gpu`).

## Concerns

- No confirmed product defect from this browser pass. The first targeted run failed two tests because the locator used the button's changing “收起” label after Escape; the locator now uses stable `aria-controls`, and the rerun passed 14/14.

## Review repair — browser acceptance

- Hash landing now requires focused target sections to intersect the viewport below the sticky header, with their top within 8px of the computed `scroll-margin-top` position. This closes the earlier offscreen false-positive gap.
- The test collects 36 hash hrefs from the rendered Header, checks 12 unique hrefs per industry, and verifies each resolves to exactly one `data-content-module` section. A real Header deep-link click is exercised on desktop and mobile for each of the three industries, in addition to the cross-route and same-route examples.
- Hover continuity uses coordinate-driven mouse movement across the trigger/panel boundary, with 70ms and 90ms pauses on either side and a 250ms dwell after entering the panel. Desktop tests also check panel mutual exclusion, absence of a modal overlay or scroll lock, exposed main content, and no overflow while open.
- Mobile coverage now checks that `/energy#solar` opens with the Energy group expanded, the overview marked `aria-current="page"`, the Solar link marked `aria-current="location"`, and no overflow while the Drawer is open.
- The server-rendered Header assertion now checks all 36 industry hash hrefs as well as the seven AI/IDC detail hrefs. A reduced-motion browser check verifies that the open menu's trigger icon has no animation and a transition duration at or below 1ms under the site's global reduced-motion rule.

### Review repair verification

- Targeted `pnpm exec playwright test e2e/public-site.spec.ts --grep 'mega menu|industry hubs' --reporter=line`: **24/24 passed** across desktop and mobile Chromium projects.
- First complete `pnpm test:e2e -- --reporter=line`: **109/110 passed**. The pre-existing mobile carousel autoplay pause assertion expected `ai` but observed `compute`; this was an assertion failure, not a trace artifact error. Its isolated desktop/mobile rerun passed **2/2**. A second complete run passed **110/110**.
- `pnpm typecheck`, `pnpm exec eslint e2e/public-site.spec.ts`, and `git diff --check`: **passed**.
- No product-code change was made. The one-off carousel autoplay failure was not reproduced by the focused rerun or complete rerun; it remains a possible timing flake outside this feature's E2E changes.

### Complete integration gate evidence from the main task

- Main agent completed `pnpm verify`: **174 unit tests passed**, typecheck passed, repository lint passed, and production build generated **18 static pages**.
- Original Task 4 complete E2E run passed **100/100**. The main agent's later complete rerun had **98 passes plus 2 trace artifact `ENOENT` errors**; those two tests passed **2/2** when rerun separately. The strengthened suite's complete rerun passed **110/110** as recorded above.
