import {routeEntries} from "./routes";
import type {PageKey, PublicPath} from "./types";

export interface NavigationLink {
  kind: "link";
  label: string;
  path: PublicPath;
  sectionId?: string;
  overviewPath?: never;
  columns?: never;
  children?: never;
}

export interface NavigationColumn {
  heading: string;
  links: readonly NavigationLink[];
}

export interface NavigationSection {
  kind: "group";
  label: string;
  overviewPath: PublicPath;
  columns: readonly NavigationColumn[];
  /** Kept for existing navigation consumers; new menus render columns. */
  children: readonly NavigationLink[];
  path?: never;
}

export type NavigationItem = NavigationLink | NavigationSection;

function routeForKey(key: PageKey) {
  const route = routeEntries.find((entry) => entry.key === key);
  if (!route) throw new Error(`Unknown page key: ${key}`);
  return route;
}

function link(key: PageKey): NavigationLink {
  const route = routeForKey(key);
  return {kind: "link", label: route.navLabel, path: route.path};
}

function sectionLink(path: PublicPath, label: string, sectionId: string): NavigationLink {
  return {kind: "link", label, path, sectionId};
}

function group(key: PageKey, columns: readonly NavigationColumn[]): NavigationSection {
  const route = routeForKey(key);
  return {
    kind: "group",
    label: route.navLabel,
    overviewPath: route.path,
    columns,
    children: columns.flatMap((column) => column.links),
  };
}

export function getNavigationHref(link: NavigationLink): string {
  if (link.sectionId === undefined) return link.path;
  const sectionId = link.sectionId.trim();
  if (!sectionId) throw new Error("Navigation sectionId must not be empty");
  return `${link.path}#${sectionId}`;
}

export const navigationGroups: readonly NavigationItem[] = [
  link("home"),
  group("ai", [
    {heading: "语言与图像", links: [link("aiLlm"), link("aiImage")]},
    {heading: "视频创作", links: [link("aiVideo")]},
  ]),
  group("idc", [
    {heading: "计算与托管", links: [link("idcVps"), link("idcBareMetal"), link("idcColocation")]},
    {heading: "GPU 算力", links: [link("idcGpu")]},
  ]),
  group("madeInChina", [
    {heading: "产品与服务", links: [
      sectionLink("/madeinchina", "产品与能力图谱", "layers"),
      sectionLink("/madeinchina", "计算硬件", "hardware"),
      sectionLink("/madeinchina", "本地 AI 部署", "local-ai"),
      sectionLink("/madeinchina", "数据保护与归档", "data"),
    ]},
    {heading: "解决方案", links: [
      sectionLink("/madeinchina", "智能客户服务", "customer-service"),
      sectionLink("/madeinchina", "线上业务办理", "online-services"),
      sectionLink("/madeinchina", "订单与经营管理", "orders"),
      sectionLink("/madeinchina", "售后工单", "after-sales"),
    ]},
    {heading: "能力与交付", links: [
      sectionLink("/madeinchina", "需求诊断", "diagnostic"),
      sectionLink("/madeinchina", "兼容性与系统集成", "compatibility"),
      sectionLink("/madeinchina", "行业解决方案", "industries"),
      sectionLink("/madeinchina", "分阶段交付", "delivery"),
    ]},
  ]),
  group("network", [
    {heading: "产品与服务", links: [
      sectionLink("/network", "产品矩阵", "products"),
      sectionLink("/network", "企业专线", "enterprise-line"),
      sectionLink("/network", "数据中心互联", "data-center-interconnect"),
      sectionLink("/network", "光纤与云网连接", "fiber-cloud"),
      sectionLink("/network", "OTN 三层传输", "otn"),
    ]},
    {heading: "解决方案", links: [
      sectionLink("/network", "总部分支互联", "branch-network"),
      sectionLink("/network", "算力节点互联", "compute-interconnect"),
      sectionLink("/network", "行业专网", "industry-network"),
      sectionLink("/network", "连续性与冗余", "continuity"),
    ]},
    {heading: "能力与交付", links: [
      sectionLink("/network", "线路需求输入", "inputs"),
      sectionLink("/network", "运维与责任边界", "interfaces"),
      sectionLink("/network", "勘察到验收", "rollout"),
    ]},
  ]),
  group("energy", [
    {heading: "产品与服务", links: [
      sectionLink("/energy", "服务矩阵", "services"),
      sectionLink("/energy", "电力市场化交易", "purchase"),
      sectionLink("/energy", "绿电与绿证", "green-power"),
      sectionLink("/energy", "综合能源管理", "management"),
    ]},
    {heading: "解决方案", links: [
      sectionLink("/energy", "节能改造与合同能源管理", "efficiency"),
      sectionLink("/energy", "分布式光伏", "solar"),
      sectionLink("/energy", "用户侧储能", "storage"),
      sectionLink("/energy", "充换电设施", "charging"),
    ]},
    {heading: "能力与交付", links: [
      sectionLink("/energy", "用能基线", "inputs"),
      sectionLink("/energy", "碳资产服务", "carbon"),
      sectionLink("/energy", "适用场景", "scenarios"),
      sectionLink("/energy", "评估与交付", "delivery"),
    ]},
  ]),
  link("about"),
];
