export type PublicPath =
  | "/" | "/ai" | "/ai/llm" | "/ai/image" | "/ai/video"
  | "/idc" | "/idc/vps" | "/idc/bare-metal" | "/idc/colocation" | "/idc/gpu"
  | "/madeinchina" | "/network" | "/energy" | "/about";

export type PageKey =
  | "home" | "ai" | "aiLlm" | "aiImage" | "aiVideo"
  | "idc" | "idcVps" | "idcBareMetal" | "idcColocation" | "idcGpu"
  | "madeInChina" | "network" | "energy" | "about";

export type PageTemplate = "home" | "overview" | "model" | "solution" | "company";

export interface RouteEntry {
  key: PageKey;
  path: PublicPath;
  navLabel: string;
  title: string;
  description: string;
  template: PageTemplate;
  relatedPaths: readonly PublicPath[];
}

export interface ContentItem {
  title: string;
  body: string;
  href?: PublicPath;
  meta?: string;
}

export interface ResourceCard {
  id: string;
  name: string;
  category: string;
  meta: string;
  specifications: readonly {
    label: string;
    value: string;
  }[];
  pricing: readonly {
    label: string;
    value: string;
  }[];
  workloads: string;
  contacts: readonly string[];
  notice: string;
}

interface ContentSectionBase {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string;
}

export type ContentSection = ContentSectionBase & (
  | {items?: readonly ContentItem[]; resourceCards?: never}
  | {items?: never; resourceCards: readonly ResourceCard[]}
);

export interface MarketingPage {
  key: PageKey;
  path: PublicPath;
  hero: {title: string; lead: string};
  sections: readonly ContentSection[];
  contactEnabled: false;
}
