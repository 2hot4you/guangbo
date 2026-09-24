# Task 1 report

Status: **DONE_WITH_CONCERNS**

Implementation commit: `804018e` (`feat: add landing page primitives and home navigation`).

## Files changed

- `src/components/marketing/landing-page-primitives.tsx` — server-safe hero, section, visual placeholder, numbered list, process rail, and exported `styles` map.
- `src/components/marketing/landing-pages.module.css` — scoped responsive design, one decorative orbit animation, reduced-motion override.
- `src/content/navigation.ts` — direct Home link at the start of shared navigation.
- `src/components/layout/mobile-navigation.tsx` — removed the separate Home row, consuming shared navigation.
- `tests/components/site-navigation.test.tsx` — first-link and current-page navigation assertions.
- `tests/components/landing-page-primitives.test.tsx` — semantic module, accessible figure, list, and server-rendering assertions.
- `.superpowers/sdd/2026-09-24-distinct-inner-pages/task-1-report.md` — this report.

## Red → green evidence

- Red: `pnpm test tests/components/site-navigation.test.tsx tests/components/landing-page-primitives.test.tsx` exited 1. Desktop first link was `大模型与AIGC` rather than `首页`; the new primitives module did not exist. The mobile first-link test already passed because the old mobile Home row was hardcoded.
- Green: the same focused command exited 0: **2 test files, 15 tests passed**.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `git diff --check --cached`: passed before the implementation commit.

## Self-check and issues

- The new primitives have no `use client` boundary or browser APIs. Hero and section each render one addressable `section` with `data-content-module`; the hero alone renders `h1`. The visual placeholder has a readable figure label and caption. All style rules are scoped to the CSS module. No dependency or global CSS changes were made for this task.
- Full `pnpm test` ran: **77 passed, 1 failed**. The out-of-scope `tests/content/routes.test.ts` still expects four direct links and 13 total navigation paths. Adding `/` makes five direct links and 14 paths. This task's file scope excludes that test, so the parent task must update its expectations.
- Pre-existing edits in `mobile-navigation.tsx` and `site-navigation.test.tsx` were preserved in the working tree and deliberately excluded from the implementation commit.

## Review fix round 1

- Scope extended to `tests/content/routes.test.ts` for the review's Important #1. The test now checks that the first navigation item is exactly the direct `首页` link to `/`, expects all five direct links in order, and expects 14 total paths. Removing Home or moving it behind another item fails an explicit assertion.
- Red: `pnpm test tests/content/routes.test.ts tests/components/site-navigation.test.tsx` exited 1 before the fix: 18 passed, 1 failed because the old direct-link expectation omitted `/`.
- Green: the same focused command exited 0: **2 files, 19 tests passed**. Full `pnpm test` exited 0: **8 files, 78 tests passed**.
- The earlier full-suite failure recorded above is resolved. Review Important #2 remains governed by the controller's ruling: this feature branch depends on the existing uncommitted homepage palette baseline; this fix did not touch `globals.css` or the CSS module.
