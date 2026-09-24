# Distinct Inner Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build six visually and structurally distinct top-level marketing pages, each with at least eight meaningful content modules, and add Home as the first shared navigation item.

**Architecture:** Keep verified copy in the existing content registry, expand each top-level page to eight or more sections, and route those six paths to dedicated server components. Share only low-level landing-page primitives and a scoped CSS module; keep detail-page templates intact.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, HeroUI React 3.2.6, Tailwind CSS 4.3, CSS Modules, Vitest and Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-24-distinct-inner-pages-design.md`

## Global Constraints

- Every `/ai`, `/idc`, `/madeinchina`, `/network`, `/energy`, and `/about` page has at least 8 elements marked `data-content-module`; Header, Footer, breadcrumbs and related services do not count.
- The six pages use distinct information architectures and must not render as one repeated card-grid template.
- Do not invent customers, certifications, prices, SLA values, inventory, real-time model availability or contact details.
- Use labeled visual placeholders instead of unverified commercial imagery.
- Preserve the black, white, light-gray and fluorescent yellow-green palette, HeroUI v3 conventions, responsive behavior, accessible semantics and server-rendered public copy.
- Keep the existing detail-page templates for `/ai/*` and `/idc/*` routes.

## Review Focus

- Removing any meaningful module must make the minimum-module test fail.
- Top-level page routing must not change the existing AI and IDC detail pages.
- A missing or duplicated section ID must be caught by semantic rendering assertions.
- Mobile layouts must keep heading-before-detail reading order even where desktop composition is reversed.
- Reduced-motion users must receive static decorative graphics without losing content.

---

### Task 1: Shared landing-page foundation and navigation

**Files:**
- Create: `src/components/marketing/landing-page-primitives.tsx`
- Create: `src/components/marketing/landing-pages.module.css`
- Modify: `src/content/navigation.ts`
- Modify: `src/components/layout/mobile-navigation.tsx`
- Modify: `tests/components/site-navigation.test.tsx`
- Create: `tests/components/landing-page-primitives.test.tsx`

**Interfaces:**
- Produces: `LandingHero`, `LandingSection`, `VisualPlaceholder`, `NumberedList`, `ProcessRail`, and exported `styles` class map used by Tasks 2 and 3.
- Produces: `navigationGroups` whose first entry is the direct `/` link.

- [ ] **Step 1: Add failing navigation tests** asserting the first desktop and mobile primary-navigation link is `首页` with `href="/"` and correct `aria-current` on the home page.
- [ ] **Step 2: Add failing primitive tests** rendering a hero, section, placeholder and process rail, then asserting one `h1`, labelled sections, accessible figure text and `data-content-module` markers.
- [ ] **Step 3: Run `pnpm test tests/components/site-navigation.test.tsx tests/components/landing-page-primitives.test.tsx`** and confirm failures are caused by the missing navigation item and components.
- [ ] **Step 4: Implement the primitives and scoped responsive CSS** with semantic HTML, no client boundary, a single decorative animation family and reduced-motion rules.
- [ ] **Step 5: Add `link("home")` to the start of `navigationGroups` and remove the mobile-only hardcoded Home row** so desktop and mobile consume one source.
- [ ] **Step 6: Re-run the focused tests** and confirm they pass.

### Task 2: AI and IDC landing pages

**Files:**
- Create: `src/components/marketing/ai-landing-page.tsx`
- Create: `src/components/marketing/idc-landing-page.tsx`
- Modify: `src/content/pages/ai.ts`
- Modify: `src/content/pages/idc.ts`
- Create: `tests/components/ai-idc-landing-pages.test.tsx`

**Interfaces:**
- Consumes: Task 1 landing primitives and `MarketingPage` content.
- Produces: `AiLandingPage({page})` and `IdcLandingPage({page})`.

- [ ] **Step 1: Write failing tests** asserting each page has one `h1`, at least 8 marked modules, all declared section IDs, distinct root classes, the AI capability/ecosystem/workflow structures, and the IDC service matrix/infrastructure/delivery structures.
- [ ] **Step 2: Run `pnpm test tests/components/ai-idc-landing-pages.test.tsx`** and confirm it fails because the dedicated components do not exist.
- [ ] **Step 3: Expand `aiOverview` to capability-map, model-ecosystem, workflows, scenarios, selection, integration, governance and availability sections** using verified model and selection language.
- [ ] **Step 4: Implement `AiLandingPage`** with an orbital hero, three-row capability map, dark model ecosystem wall, process rail, scenario band, comparison list, integration path and availability note.
- [ ] **Step 5: Expand `idcOverview` to service-matrix, workload-map, deployment-conditions, locations, infrastructure-stack, scenarios, migration and delivery sections** without configuration or stock claims.
- [ ] **Step 6: Implement `IdcLandingPage`** with a rack-grid hero, four-column service matrix, workload mapping, region placeholder, five-layer infrastructure stack, scenario split, migration rail and delivery checklist.
- [ ] **Step 7: Re-run the focused tests** and confirm they pass.

### Task 3: Xinchang, network, energy and company landing pages

**Files:**
- Create: `src/components/marketing/xinchang-landing-page.tsx`
- Create: `src/components/marketing/network-landing-page.tsx`
- Create: `src/components/marketing/energy-landing-page.tsx`
- Create: `src/components/marketing/about-landing-page.tsx`
- Modify: `src/content/pages/business.ts`
- Create: `tests/components/business-landing-pages.test.tsx`

**Interfaces:**
- Consumes: Task 1 landing primitives and `MarketingPage` content.
- Produces: `XinchangLandingPage`, `NetworkLandingPage`, `EnergyLandingPage`, and `AboutLandingPage`.

- [ ] **Step 1: Write failing tests** asserting every page has one `h1`, at least 8 marked modules, unique section IDs and its required unique visual structure.
- [ ] **Step 2: Run `pnpm test tests/components/business-landing-pages.test.tsx`** and confirm it fails because dedicated components do not exist.
- [ ] **Step 3: Expand the four content entries** to the exact section sets defined by the design spec, preserving existing facts and adding only explanatory selection, workflow and boundary copy.
- [ ] **Step 4: Implement the Xinchang page** as a layered architecture blueprint with compatibility and phased-delivery structures.
- [ ] **Step 5: Implement the network page** as a left-to-right topology canvas with product, continuity, interface and rollout modules.
- [ ] **Step 6: Implement the energy page** as an energy-flow narrative with load inputs, service paths, project spectrum and evaluation flow.
- [ ] **Step 7: Implement the about page** as a company narrative with business map, practice, ecosystem boundary, principles and contact placeholder.
- [ ] **Step 8: Re-run the focused tests** and confirm they pass.

### Task 4: Routing integration and full verification

**Files:**
- Modify: `src/components/marketing/marketing-page.tsx`
- Modify: `tests/components/marketing-page.test.tsx`
- Modify: `tests/content/pages.test.ts`
- Modify: `.ccg/tasks/distinct-inner-pages/task.json`
- Create: `.ccg/tasks/distinct-inner-pages/review.md`

**Interfaces:**
- Consumes: all six dedicated landing components.
- Produces: final top-level route selection while preserving generic detail templates.

- [ ] **Step 1: Add failing integration tests** that render all six paths through `MarketingPageView`, verify their dedicated `data-landing-page` values, module counts and public internal links, and verify `/ai/llm` plus `/idc/gpu` still use their existing templates.
- [ ] **Step 2: Run `pnpm test tests/components/marketing-page.test.tsx tests/content/pages.test.ts`** and confirm the routing assertions fail before integration.
- [ ] **Step 3: Route the six exact paths to their dedicated components** before the generic template switch, leaving breadcrumbs and related services behavior unchanged.
- [ ] **Step 4: Run the focused integration tests**, then `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
- [ ] **Step 5: Start or reuse the fixed `http://localhost:43187` development server** and inspect all six pages at mobile and desktop widths for overflow, section order, visible placeholder labels and reduced-motion behavior.
- [ ] **Step 6: Run dual-model review where the configured wrapper is available; otherwise record the missing-wrapper limitation in `review.md`** and perform local diff/test/browser review.
