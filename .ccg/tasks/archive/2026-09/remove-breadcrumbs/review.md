# Review: remove-breadcrumbs

## Scope

- 从共享营销页面框架中移除面包屑渲染。
- 删除专用 HeroUI 面包屑组件及其样式，不保留空白占位。
- 将组件测试和浏览器测试统一为所有公开页面均不得出现面包屑导航。

## TDD evidence

- RED：详细页 `/ai/llm` 在桌面和移动浏览器中均返回 1 个“面包屑导航”，新断言要求为 0。
- GREEN：移除共享渲染后，桌面端 14/14、移动端 14/14 个公开页面定向场景通过。
- 组件测试同步清理旧契约，完整 Vitest 184/184 通过。

## Review

外部 CCG wrapper 在当前环境不可用，改由两个独立只读审查代理分别检查需求符合度与工程质量。双方均未发现面包屑实现、样式或占位残留；无 Critical / Warning。

审查期间类型检查曾被 `.next/types` 中四个完全相同的 `* 2.ts` 重复生成缓存阻断。确认这些文件受 `.gitignore` 管理且与标准文件逐字一致后，仅删除重复缓存；停止开发服务器后重新执行完整校验通过。

## Verification

- `pnpm verify`：通过；Vitest 184/184、类型检查、Lint、生产构建均通过，生成 18 个静态页面。
- Playwright 定向验收：桌面端 14/14、移动端 14/14 个公开页面均无面包屑导航。
- `rg` 检查：生产代码与样式中无 breadcrumb / 面包屑 / `breadcrumbs-wrap` 残留。

## Result

无未解决的 Critical 或 Warning，可以交付。
