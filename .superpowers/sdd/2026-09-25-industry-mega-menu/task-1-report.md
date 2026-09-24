# Task 1 — Typed navigation information architecture

## Status

Implemented the shared five-group navigation contract. Home and About remain direct links. `NavigationSection.columns` contains typed `NavigationLink` records, and `getNavigationHref` builds full paths and hashes from `PublicPath` plus a non-empty `sectionId`. The existing `children` field is derived from columns for compatibility with the current navigation components.

## RED / GREEN evidence

- RED: `pnpm test tests/content/routes.test.ts` exited 1 with 5 expected failures: the three industry entries were still links, AI/IDC lacked columns, industry columns were absent, and `getNavigationHref` was absent. Result: 4 passed, 5 failed.
- GREEN: `pnpm test tests/content/routes.test.ts` exited 0 with 9 passed.
- Final required command: `pnpm test tests/content/routes.test.ts && pnpm test` exited 0; focused tests 9/9 and full suite 159/159 across 14 files.
- Additional checks: `pnpm typecheck`, targeted ESLint, and `git diff --check` exited 0.
- Vitest emitted its pre-existing warning about native loading of `vitest.config.ts` and an informational jsdom performance note; neither affected results.

## Files changed

- `src/content/navigation.ts` — typed columns, five business groups, route-safe links, href builder, compatibility children.
- `src/content/index.ts` — exported the column type and href builder.
- `tests/content/routes.test.ts` — verified group structure, public route reachability, product/solution columns, VPS, and hash validity.
- `.superpowers/sdd/2026-09-25-industry-mega-menu/task-1-report.md` — this handoff.

## Exact section ID contract for industry pages

Each ID below is referenced by one menu link on the named path. Task 3 must render exactly one section with each ID on the corresponding page.

- `/madeinchina`: `diagnostic`, `layers`, `hardware`, `local-ai`, `customer-service`, `online-services`, `orders`, `after-sales`, `data`, `compatibility`, `industries`, `delivery`.
- `/network`: `inputs`, `products`, `enterprise-line`, `data-center-interconnect`, `fiber-cloud`, `otn`, `branch-network`, `compute-interconnect`, `industry-network`, `continuity`, `interfaces`, `rollout`.
- `/energy`: `inputs`, `services`, `purchase`, `green-power`, `management`, `efficiency`, `solar`, `storage`, `charging`, `carbon`, `scenarios`, `delivery`.

## Risks and self-review

- The new IDs for expanded industry modules do not all exist in the current eight-module page implementations. Hash deep links to those modules depend on Task 3 completing the exact ID contract above. Existing IDs were reused where they already matched.
- Task 2 should render `columns` and call `getNavigationHref` for child links. The compatibility `children` array is derived from the same column data, so existing components continue to typecheck during the transition.
- No `/console`, unregistered path, raw `#`, or empty hash target was introduced. All fourteen public paths remain reachable from the navigation hierarchy.
