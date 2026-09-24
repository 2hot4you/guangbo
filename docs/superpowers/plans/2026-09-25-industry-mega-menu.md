# Industry Content and Mega Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the three industry hubs to at least twelve material-backed modules each and expose every business product and solution through an accessible full-width Header Mega Menu.

**Architecture:** A typed navigation model remains the single source for desktop and mobile links. Desktop renders an always-mounted, full-width disclosure panel controlled by a small client component; mobile reuses the HeroUI v3 Drawer. Industry pages keep their existing visual identities while their content records and renderers gain finer-grained modules.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, HeroUI React 3.2.6, Tailwind CSS 4, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-25-industry-mega-menu-design.md`

## Global Constraints

- Use only HeroUI React v3 APIs; do not add `HeroUIProvider`, `@heroui/theme`, or HeroUI v2 CLI initialization.
- Preserve the stylesheet import order: `tailwindcss` first, then `@heroui/styles`.
- Keep public content server-rendered and isolate interaction in existing small client navigation components.
- Use only project materials for copy; do not invent prices, inventory, SLA, certification, ownership, or partner capabilities.
- Preserve the seven existing top-level destinations and the disabled login/register placeholders.
- Every configured hash link must point to exactly one rendered section ID.
- Follow test-first development: write the expectation, observe the intended failure, then implement.

## Review Focus

- Moving the pointer from a trigger to the full-width panel must not close it.
- Closed panels must remain in HTML for discoverability but must not be keyboard focusable.
- Hash navigation across routes must reach the target instead of being reset to page top.
- Current-page and current-section semantics must remain correct for detailed AI and IDC routes.
- Long labels at the `xl` breakpoint must not collide with the account actions or create horizontal overflow.

---

### Task 1: Typed navigation information architecture

**Files:**
- Modify: `src/content/navigation.ts`
- Modify: `src/content/index.ts`
- Test: `tests/content/routes.test.ts`

**Interfaces:**
- Produces `NavigationSection.columns`, each containing typed links with `path: PublicPath` and optional `sectionId: string`.
- Produces `getNavigationHref(link): string` for both desktop and mobile renderers.

- [ ] **Step 1: Write failing navigation tests**

Assert that AI, IDC, signal, network, and energy are groups; that VPS is reachable; that signal/network/energy expose product and solution columns; and that every hash target uses a non-empty `sectionId`.

- [ ] **Step 2: Run the focused test and confirm the old two-group model fails**

Run: `pnpm test tests/content/routes.test.ts`

- [ ] **Step 3: Implement the typed column model and complete link inventory**

Keep `PublicPath` strict and build hashes from `path + sectionId`; never introduce raw `#`, `/console`, or non-existent paths.

- [ ] **Step 4: Run the focused test and full unit suite**

Run: `pnpm test tests/content/routes.test.ts && pnpm test`

### Task 2: Full-width desktop Mega Menu, mobile groups, and hash focus

**Files:**
- Modify: `src/components/layout/desktop-navigation.tsx`
- Modify: `src/components/layout/mobile-navigation.tsx`
- Modify: `src/components/layout/route-transition-focus.tsx`
- Modify: `src/components/marketing/landing-page-primitives.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/components/site-navigation.test.tsx`

**Interfaces:**
- Consumes `navigationGroups`, `NavigationSection.columns`, and `getNavigationHref` from Task 1.
- Produces stable panel IDs `desktop-panel-<overview slug>` and section focus targets.

- [ ] **Step 1: Replace the obsolete “no desktop menus” expectation with failing interaction tests**

Cover hover/focus open, one panel at a time, Escape focus return, all links present while closed, mobile industry groups, and cross-route hash scrolling.

- [ ] **Step 2: Run the focused tests and confirm failures describe missing Mega Menu behavior**

Run: `pnpm test tests/components/site-navigation.test.tsx`

- [ ] **Step 3: Implement the desktop disclosure state and panel markup**

Use native nav/link/button semantics, a 180ms close timer, `visibility` plus pointer-event control, no `role=menu`, and no conditional removal of panel links.

- [ ] **Step 4: Update the mobile Drawer to consume the same grouped data**

Keep overview navigation separate from the expand button and render column headings plus all child links.

- [ ] **Step 5: Make route transitions hash-aware**

Skip top reset when a valid hash exists, scroll/focus the target after render, and give landing sections `tabIndex={-1}` plus Header-safe scroll margin.

- [ ] **Step 6: Run focused tests, unit suite, typecheck and lint**

Run: `pnpm test tests/components/site-navigation.test.tsx && pnpm test && pnpm typecheck && pnpm lint`

### Task 3: Expand signal, network, and energy industry hubs

**Files:**
- Modify: `src/content/pages/business.ts`
- Modify: `src/components/marketing/xinchang-landing-page.tsx`
- Modify: `src/components/marketing/network-landing-page.tsx`
- Modify: `src/components/marketing/energy-landing-page.tsx`
- Test: `tests/app/public-pages.test.tsx`
- Test: `tests/content/pages.test.ts`

**Interfaces:**
- Consumes the exact section IDs referenced by Task 1.
- Produces at least twelve `data-content-module` sections per industry page with unique IDs.

- [ ] **Step 1: Add failing content and render tests**

Assert twelve or more modules, unique IDs, the material-backed product names, solution headings, and presence of every navigation section target.

- [ ] **Step 2: Run focused tests and confirm the current eight-module pages fail**

Run: `pnpm test tests/app/public-pages.test.tsx tests/content/pages.test.ts`

- [ ] **Step 3: Expand the content records using project materials**

Use consultative wording and retain ownership/availability caveats. Split signal applications, network connectivity products, and energy project services into precise sections.

- [ ] **Step 4: Render distinct layouts for the new modules**

Reuse `LandingSection`, `NumberedList`, and `ProcessRail` while preserving the system-blueprint, link-topology, and enterprise-energy-path visual languages.

- [ ] **Step 5: Run focused tests and full unit suite**

Run: `pnpm test tests/app/public-pages.test.tsx tests/content/pages.test.ts && pnpm test`

### Task 4: Browser verification and final quality gates

**Files:**
- Modify: `e2e/public-site.spec.ts`
- Modify: `.ccg/tasks/add-header-mega-menu/task.json`
- Create: `.ccg/tasks/add-header-mega-menu/review.md`

**Interfaces:**
- Consumes completed navigation and industry pages from Tasks 1–3.

- [ ] **Step 1: Add failing browser checks before the integrated implementation is considered complete**

Cover full-width panel geometry, trigger-to-panel hover continuity, keyboard Escape, mobile expansion, real hash landing, module counts, and no horizontal overflow.

- [ ] **Step 2: Run targeted browser checks and address only failures within this feature scope**

Run: `pnpm exec playwright test e2e/public-site.spec.ts --grep "mega menu|industry hubs"`

- [ ] **Step 3: Run complete verification**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build && pnpm test:e2e`

- [ ] **Step 4: Review the complete diff and record Critical/Warning/Info findings**

Verify content accuracy, accessibility, responsive layout, route reachability, and absence of unrelated changes.

- [ ] **Step 5: Archive the CCG task and commit exact scoped files**

Move `.ccg/tasks/add-header-mega-menu` to `.ccg/tasks/archive/2026-09/` and create the required archive commit without staging unrelated untracked files.
