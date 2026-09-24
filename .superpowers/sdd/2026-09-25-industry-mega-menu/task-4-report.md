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
- This report covers browser acceptance and the listed static checks. Other integration gates are owned by the main task.
