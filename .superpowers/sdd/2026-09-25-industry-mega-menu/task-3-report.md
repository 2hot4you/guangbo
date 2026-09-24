# Task 3 — Industry hub content and rendering

## Status

Implemented twelve body modules on each of `/madeinchina`, `/network`, and `/energy`. Each page renders all twelve exact Task 1 navigation section IDs once, plus its existing hero module. The pages retain their distinct system blueprint, link topology, and enterprise energy path layouts.

## RED / GREEN

- RED: Added content and server render tests before implementation. `pnpm test tests/app/public-pages.test.tsx tests/content/pages.test.ts` exited 1: 6 expected failures, 22 passed. The existing pages had eight body sections and nine rendered modules including the hero.
- GREEN: The same focused command exited 0: 28/28 tests passed in two files. It checks exact ID order in content, unique IDs, material backed product and solution terms, and one rendered section per navigation target.

## Material and editorial boundary

- Signal content follows `docs/网站各板块介绍页文案.md` section 11 and doc-17 through doc-21 in `docs/逐文件产品方案与架构摘要.md`. Existing four layer blueprint remains an editorial framework. Hardware, local AI, customer service, online handling, orders, after sales, data, compatibility, industry examples, and phased delivery have separate modules. Specific software functions and hardware configurations are framed as selection or validation subjects.
- Network content follows section 12 and doc-22, with the established company network context from doc-02/03. Enterprise lines, data center links, fiber/cloud, OTN, branch, compute, and industry network sections are separated. The OTN structure is an optional path based on partner resources; no nationwide coverage, measured latency, protection result, or fixed SLA is attributed to Guangbo.
- Energy content follows section 13 and doc-23/24. The page separates market based electricity transaction consultation, green power/certificates, energy management, efficiency/contract energy management, solar, storage, charging, carbon, scenarios, and delivery. Partner licenses, assets, transaction scale, customer results, and equipment ownership are not attributed to Guangbo. Project applicability and implementation responsibility remain subject to the specific plan.
- No model performance, inventory, price, region availability, construction time, or SLA numbers were added. Consultation and solution matching language remains the public posture.

## Self review and validation

- Checked all three page records against the exact Task 1 ID contract; twelve IDs per page, no duplicates. Rendered output has thirteen content modules per page including each hero.
- `pnpm test tests/app/public-pages.test.tsx tests/content/pages.test.ts`: PASS, 28/28.
- `pnpm typecheck`: PASS.
- Targeted ESLint on six changed code/test files: PASS.
- `git diff --check`: PASS.
- Initial `pnpm test` before integration: FAIL, 157 passed and 14 failed while the shared navigation implementation was still in progress and legacy page tests expected old module IDs.

## Integration repair round 1

- Updated the seven stale industry page assertions: signal, network and energy now expect a hero plus twelve body modules; About still expects a hero plus eight. Retired `topology`, `boundaries`, and `projects` assertions now target the real `otn`, `continuity`/`interfaces`, and `solar` modules with their current copy.
- The server render test now reads the actual `navigationGroups` configuration and verifies all twelve hash targets per industry path occur exactly once in that page's rendered sections. This complements the fixed content map assertion and catches later navigation drift.
- Related tests: `pnpm test tests/components/business-landing-pages.test.tsx tests/components/marketing-page.test.tsx tests/app/public-pages.test.tsx tests/content/pages.test.ts` PASS, 78/78 across four files.
- Full suite: `pnpm test` PASS, 174/174 across fourteen files.
- `pnpm typecheck` and targeted ESLint on the four repaired test files: PASS.
- The Vite native config loader warning and jsdom performance note remain informational.

## Files changed

- `src/content/pages/business.ts`
- `src/components/marketing/xinchang-landing-page.tsx`
- `src/components/marketing/network-landing-page.tsx`
- `src/components/marketing/energy-landing-page.tsx`
- `tests/app/public-pages.test.tsx`
- `tests/content/pages.test.ts`
- `tests/components/business-landing-pages.test.tsx` (integration repair)
- `tests/components/marketing-page.test.tsx` (integration repair)
- `.superpowers/sdd/2026-09-25-industry-mega-menu/task-3-report.md`
