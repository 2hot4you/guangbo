# 部署审查

## 结论

本次部署成功，可继续对外服务。两路独立复核均未发现 Critical 问题。

## 发布一致性

- 远端分支 `feat/frontend-foundation` 精确指向应用提交 `5fd1753e06db8f350ef6727561dd771047d3653f`。
- 服务器使用该提交的干净 `git archive` 构建镜像 `guangbo-web:5fd1753e06db8f350ef6727561dd771047d3653f`。
- 运行容器镜像 ID 为 `sha256:44a88ccca59dfbc50c3d81cf5c5b798f0230bc32855ab69d817537cabb28036e`，与新构建镜像一致。

## 运行与内容验证

- 容器状态为 `healthy/running`，重启次数为 0，启动日志无错误。
- 宿主机只监听 `127.0.0.1:43187`；Compose 仍使用 `127.0.0.1:43187:43187`。
- 本机首页返回 200；裸金属页命中 `DeepBlue bz-4002`、两个已获准公开的手机号和库存提示，并确认不再出现“全国 VPS 租赁”。
- 公网首页返回 200，裸金属页命中新资源；`robots.txt` 与 `sitemap.xml` 均返回 200。
- 首页 canonical、robots 中的 sitemap 地址及 sitemap URL 均使用 `https://lightwavetech.cn`。

## 回滚

- 旧镜像 `guangbo-web:65c0845` 及其镜像 ID 已保留，未执行镜像清理。
- 旧 Compose 配置保存在 `/opt/guangbo/compose.production.yml.bak.65c0845`。
- 本次未实际演练回滚；回滚材料已验证存在。这是非阻断性 Warning。

## 安全与暴露面

- `ss` 证明应用只在服务器回环地址监听，公网访问通过既有反向代理。
- 外部对公网 IP 的 `43187` TCP 握手可以建立，但 HTTP 请求收到空响应，未直接访问到应用。建议在腾讯云安全组中确认并关闭不需要的 `43187` 入站规则；这不影响当前应用仅绑定回环地址的结论。

## 双路审查摘要

- 仓库/发布复核：无 Critical；提交、镜像、容器与公网内容一致，可判定部署成功。
- 安全/回滚复核：无 Critical；回环绑定与健康状态正常，旧镜像和配置备份可用于回滚；未演练回滚为 Warning。
- 项目约定的 `~/.claude/bin/codeagent-wrapper` 在当前主机不存在，因此改用两个现有的独立部署审查代理完成交叉复核。
