# 部署审查

## 结论

部署成功。两路独立复核均未发现 Critical 问题。

## 发布一致性

- 远端 `feat/frontend-foundation` 精确指向 `a04b049d6a9ecbd7804eaf8ccfa7f819bf56cfcc`。
- 使用该提交的干净 Git 归档构建镜像 `guangbo-web:a04b049d6a9ecbd7804eaf8ccfa7f819bf56cfcc`。
- 运行容器镜像 ID 为 `sha256:f4cf4bec84b50f9cc6d2a670aaeee8a10cec8bfcd0376be75159ce6dca991ebe`，与构建镜像一致。

## 运行与验收

- 容器为 `healthy/running`，重启次数为 0，启动日志无错误。
- Compose 与宿主机监听均保持 `127.0.0.1:43187`。
- 本机与公网首页返回 200。
- 本机与公网裸金属页面均显示“裸金属资源配置”，HTML 中恰好有一张 `bare-metal-resource` 卡片，并包含 DeepBlue、参考价格和库存提示。
- `robots.txt`、`sitemap.xml` 返回 200；canonical、robots sitemap 地址和 sitemap URL 均为 `https://lightwavetech.cn`。

## 回滚

- 旧镜像 `guangbo-web:5fd1753e06db8f350ef6727561dd771047d3653f` 及其镜像 ID 继续保留，未执行清理。
- 切换前 Compose 备份为 `/opt/guangbo/compose.production.yml.bak.5fd1753-before-a04b049`，备份校验值与切换前配置一致。
- 未实际演练回滚；回滚材料已验证存在，属于非阻断 Warning。

## 后续安全提醒

- 应继续在腾讯云安全组确认并关闭不需要的公网 `43187` 入站规则；应用本身仍仅绑定回环地址。
