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
