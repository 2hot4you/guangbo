# Guangbo project instructions

The active CCG workflow and user instructions remain authoritative. This file only adds project-specific frontend guidance.

## HeroUI React v3

- Read `HEROUI_REFERENCE.md` and the relevant file under `.heroui-docs/react/` before using a HeroUI component.
- Use only HeroUI React v3 APIs with React 19 and Tailwind CSS 4.
- Do not add `HeroUIProvider`, `@heroui/theme`, or HeroUI v2 CLI initialization.
- Preserve the import order: `tailwindcss` first, then `@heroui/styles`.
- Keep public page content server-rendered; isolate stateful controls in small client components.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
