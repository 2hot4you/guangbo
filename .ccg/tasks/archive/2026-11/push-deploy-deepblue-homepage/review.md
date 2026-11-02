# 推送与部署审查记录

## 发布版本

- 目标提交：`7682c573666e6e6c03f534489ee59ba7ab4e8ecf`
- 远端分支：`feat/frontend-foundation`
- 推送后远端 SHA 与目标提交完全一致。
- 发布包 SHA-256：`e57e2a3102e560de837fa4b43207e5362ab6df92b7b5c8a6174f8b6dcd16d505`
- 服务器校验值与本地一致，构建来源为该提交的 `git archive`。

## 验证与镜像

- 推送前 `pnpm verify` 通过：14 个测试文件、189 项测试、类型检查、Lint 和生产构建全部通过。
- 新镜像：`guangbo-web:7682c573666e6e6c03f534489ee59ba7ab4e8ecf`
- 新镜像 ID：`sha256:cb9b79cd21bb6d940aad9a86fb4496491dc0ddf0f7b61686b07f97bdfb3f53db`
- 运行容器的镜像 ID 与新镜像 ID 完全一致，状态 `running/healthy`，重启次数 0。
- 宿主机只监听 `127.0.0.1:43187`。

## 线上验收

- 公网首页、`/idc/bare-metal`、`robots.txt` 和 `sitemap.xml` 均返回 200；robots 与 sitemap 内容均使用 `https://lightwavetech.cn`，不含本地地址。
- 首页和裸金属详情页均显示 `DeepBlue Server`，公开 HTML 均不含 `bz-4002`。
- 首页已核对双 RTX 3090 摘要、参考价格、授权手机号、库存限定语和详情链接。
- 裸金属详情页仍包含完整配置与平台信息。
- 首页 canonical 指向 `https://lightwavetech.cn`，容器日志只有正常启动信息。

## 回滚点

- 旧镜像仍保留：`guangbo-web:37284b193bc6967a641a3c40e464490abfbc99f3`
- 旧镜像 ID：`sha256:149a6f704d7cbb233032f774e4c11c846a18ca1ad389fc59decf188fd582e1d0`
- Compose 备份：`/opt/guangbo/compose.production.yml.bak.37284b1-before-7682c57`
- 备份校验值与切换前 Compose 完全一致；未执行实际回滚演练。

## 双重审查结论

- 部署安全审查：无 Critical；回环监听、内容口径和回滚材料符合要求。
- 仓库与部署审查：远端 SHA、发布包、新旧镜像、Compose 和公网验收证据完整；无已发现故障。
- 维护提示：建议在云安全组中关闭公网 43187 入站规则；应用本身未通过该端口提供公网 HTTP 服务。
