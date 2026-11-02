# 审查与交付记录

## 代码与测试

- 应用提交：`37284b193bc6967a641a3c40e464490abfbc99f3`
- `pnpm verify` 通过：188 项测试、类型检查、Lint 和生产构建全部通过。
- Footer 相关 Playwright 检查通过：桌面端和移动端的响应式布局、触控尺寸、横向溢出与键盘焦点共 4 项。
- 备案信息位于全站 Footer 最后一行，链接为 `https://beian.miit.gov.cn`，不使用新窗口跳转。

## 线上部署

- 生产镜像：`guangbo-web:37284b193bc6967a641a3c40e464490abfbc99f3`
- 镜像 ID：`sha256:149a6f704d7cbb233032f774e4c11c846a18ca1ad389fc59decf188fd582e1d0`
- 容器：`running`、`healthy`、重启次数 0。
- 监听地址：仅 `127.0.0.1:43187`。
- 公网首页、`/idc/bare-metal`、`robots.txt`、`sitemap.xml` 均返回 200。
- 公网页面已核对备案号、工信部 HTTPS 链接和版权信息。

## 回滚点

- 旧镜像仍保留：`guangbo-web:a04b049d6a9ecbd7804eaf8ccfa7f819bf56cfcc`
- Compose 备份：`/opt/guangbo/compose.production.yml.bak.a04b049-before-37284b1`
- 备份校验值与切换前 Compose 一致。

## 双重审查结论

- 安全审查：无 Critical；回环监听、健康状态和回滚资源符合要求。未单独执行回滚演练，作为 Info/Warning 记录。
- UI/E2E 审查：无 Critical；全局页脚、原生链接、移动端 44px 触控高度和焦点样式符合要求。
- 唯一维护提示：年份在静态构建时生成，跨年后应重新构建发布。
