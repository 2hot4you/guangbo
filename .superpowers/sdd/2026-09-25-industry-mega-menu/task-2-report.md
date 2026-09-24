# Task 2 — Full-width header Mega Menu

## Status

Implemented the desktop disclosure navigation, mobile grouped navigation, and hash-aware section focus within the assigned scope. Navigation-focused validation, typecheck and lint pass. The full suite currently has seven failures in the concurrently expanded industry-page fixtures outside this task's ownership; they are listed below and were reported to the lead agent.

## Implementation

- Desktop uses native overview links and independent disclosure buttons for all five business groups. All column links remain mounted in the initial markup. Closed panels use `visibility: hidden`, `pointer-events: none`, `inert`, `aria-hidden`, and negative child tab indices.
- Hover and keyboard focus open one panel at a time. Leaving a group schedules closure at 180ms; entering its panel cancels closure. Escape works even when a panel is only hovered and focus is elsewhere, then returns focus to its button without reopening. Route/hash changes reset the disclosure state.
- Panels have stable `desktop-panel-<slug>` IDs and absolute positioning across the sticky site-header; their column layout follows the site content width. Existing reduced-motion CSS applies to indicator transitions.
- Mobile keeps HeroUI v3 Drawer and its Escape/close behavior, renders column headings, and expands the current overview or detail group by default.
- Both consumers use `columns` and `getNavigationHref`. Full href keys remove duplicate React keys, and section links receive `aria-current="location"` only when their hash matches.
- Shared hash subscription handles hashchange, popstate, and Link history updates after click. Route focus preserves hash navigation, waits for delayed section rendering, focuses the target and scrolls it into view. Deferred top resets check for a hash before scrolling. Landing sections have `tabIndex={-1}` and a 6.5rem sticky-header scroll margin.

## Files changed

- `src/components/layout/desktop-navigation.tsx`
- `src/components/layout/mobile-navigation.tsx`
- `src/components/layout/route-transition-focus.tsx`
- `src/components/marketing/landing-page-primitives.tsx`
- `src/app/globals.css`
- `tests/components/site-navigation.test.tsx`
- `.superpowers/sdd/2026-09-25-industry-mega-menu/task-2-report.md`

## RED / GREEN

- Initial RED: `pnpm test tests/components/site-navigation.test.tsx` exited 1 with 7 failed / 14 passed. Missing desktop buttons/panels, missing mobile column headings, and missing cross-route/delayed hash focus failed as expected. The run also reproduced duplicate industry-child React keys.
- Initial GREEN: the focused command passed 21/21 after implementation.
- Additional RED: an Escape regression test for a hovered menu with focus outside navigation failed with `aria-expanded="true"`; 22 passed / 1 failed. A same-route history-update hash test passed.
- Final GREEN: focused command passed 23/23 after document-level Escape handling.

## Validation

- `pnpm test tests/components/site-navigation.test.tsx`: **PASS**, 23 tests.
- `pnpm typecheck`: **PASS**, exit 0.
- `pnpm lint`: **PASS**, exit 0.
- `git diff --check`: **PASS**, exit 0.
- `pnpm test`: **FAIL**, final run 166 passed / 7 failed, 12 passing files / 2 failing files. All navigation tests pass. The following tests still assume pre-expansion industry markup:
  - `business-landing-pages.test.tsx`: `renders the 信创 content as one h1 and nine addressable modules` — actual module count is 13.
  - `business-landing-pages.test.tsx`: `renders the 专线 content as one h1 and nine addressable modules` — actual module count is 13.
  - `business-landing-pages.test.tsx`: `renders the 能源 content as one h1 and nine addressable modules` — actual module count is 13.
  - `business-landing-pages.test.tsx`: `keeps the 专线 detail figure caption readable` — old section lookup is null.
  - `business-landing-pages.test.tsx`: `shows a left-to-right station route and explicit connection boundaries` — old `boundaries` ID is absent.
  - `business-landing-pages.test.tsx`: `follows energy inputs through service paths and project options` — old `projects` ID is absent.
  - `marketing-page.test.tsx`: `shows a semantic station connection route with the source explanation` — old `topology` ID is absent.

## Concerns / remaining integration work

- Lead/industry-test owner must reconcile the seven existing industry-page assertions and rerun the full suite. Those files were not modified by this task.
- Production build and browser validation are deferred to the integration gate: check full-width geometry/no horizontal overflow, physical touch input, and real Next Link cross-route and same-route hash focus with Drawer focus restoration.
- Vite emits the existing native config-loader warning; it does not affect focused test results.
- No changes were made to CCG workflow state, unrelated files, or other agents' work.

## Fix round 1 — W1 touch activation

### Change

Addressed the review's reproduced first-tap failure. Desktop hover now uses pointer enter/leave handlers restricted to `pointerType === "mouse"`, so compatibility mouse events emitted after a touch cannot open the panel. Pointer-induced focus remains suppressed through pointerup until click completes; pointer cancellation or keyboard input resets that suppression. Each click therefore toggles once, while mouse hover, keyboard focus and Escape retain their behavior.

Changed only `desktop-navigation.tsx`, `site-navigation.test.tsx`, and this report. Existing hover timing assertions now dispatch mouse pointer events, matching the browser event boundary.

### RED / GREEN

- RED: added the full `pointerenter(touch) → pointerdown(touch) → pointerup(touch) → mouseover → mousedown → focusin → mouseup → click` regression sequence. `pnpm test tests/components/site-navigation.test.tsx` failed at the first-tap assertion: expected `aria-expanded="true"`, received `"false"`; 23 passed / 1 failed.
- GREEN: after the fix, the same focused command passed 24/24, including first tap open and second tap close, mouse hover/delayed close, keyboard focus/Tab, and Escape.

### Validation

- `pnpm test tests/components/site-navigation.test.tsx`: **PASS**, 24/24.
- `pnpm test`: **PASS**, 174/174 across 14 files. The earlier seven industry-page failures have been resolved by the parallel integration work; this task did not modify those files.
- `pnpm typecheck`: **PASS**.
- `pnpm lint`: **PASS**.
- `git diff --check`: **PASS**.
- Real Chrome via Playwright, 1440×1000 and `hasTouch: true`: **PASS**. Two actual `tap()` calls leave the network disclosure expanded then collapsed. Subsequent mouse hover opens the AI disclosure, and Escape closes it and focuses its button.
- The default Playwright bundled Chromium executable was absent; the browser verification used the installed Chrome channel successfully without installing dependencies.

### Remaining concerns

No remaining W1 issue observed. Full production build and the complete e2e suite remain the lead agent's integration checks. The existing Vite native-loader warning remains informational.
