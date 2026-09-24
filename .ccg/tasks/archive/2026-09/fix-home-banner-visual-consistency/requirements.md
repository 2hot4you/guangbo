# 首页 Banner 视觉一致性修订

## 用户要求

- Banner 圆形视觉内的节点文字统一使用英文。
- LINK 与 ENERGY Banner 不再使用独立背景风格，改为与 COMPUTE / XINCHUANG 相同的浅色中性背景体系。
- ENERGY 标题区域移除额外背景色与边框，恢复与其他 Banner 相同的开放式排版。

## 根因证据

- `home-hero-visual.tsx` 的 `xinchang`、`link`、`energy` 节点数组直接写入中文，而 `ai`、`compute` 使用英文。
- `home-hero-carousel.module.css` 将 LINK 根背景设为荧光黄绿 `#dfff46`，与其他浅色 Banner 不一致。
- ENERGY 的 `.copy` 单独添加了边框、padding 与 `#fbfbf9` 背景，形成标题卡片。

## 验收标准

- 五种 HeroVisual 节点全部只含英文文本。
- COMPUTE、XINCHUANG、LINK、ENERGY 使用同一个浅灰背景色；AI 保留现有近白背景。
- ENERGY copy 的背景透明、边框为 0，桌面与移动端不再呈现标题卡片。
- 单元测试、类型检查、Lint 与首页浏览器回归通过。
