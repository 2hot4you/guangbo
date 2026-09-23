# Guangbo project instructions

The active CCG workflow and user instructions remain authoritative. This file only adds project-specific frontend guidance.

## HeroUI React v3

- Read `HEROUI_REFERENCE.md` and the relevant file under `.heroui-docs/react/` before using a HeroUI component.
- Use only HeroUI React v3 APIs with React 19 and Tailwind CSS 4.
- Do not add `HeroUIProvider`, `@heroui/theme`, or HeroUI v2 CLI initialization.
- Preserve the import order: `tailwindcss` first, then `@heroui/styles`.
- Keep public page content server-rendered; isolate stateful controls in small client components.
