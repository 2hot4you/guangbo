import type {MarketingPage, PageKey, PublicPath} from "../types";
import {home} from "./home";
import {ai, aiImage, aiLlm, aiVideo} from "./ai";
import {idc, idcBareMetal, idcColocation, idcGpu, idcVps} from "./idc";
import {about, energy, madeInChina, network} from "./business";

export const marketingPages = {
  home, ai, aiLlm, aiImage, aiVideo,
  idc, idcVps, idcBareMetal, idcColocation, idcGpu,
  madeInChina, network, energy, about,
} as const satisfies Record<PageKey, MarketingPage>;

export function getPage(key: PageKey): MarketingPage {
  return marketingPages[key];
}

export function getPageByPath(path: PublicPath): MarketingPage {
  const page = Object.values(marketingPages).find((candidate) => candidate.path === path);
  if (!page) throw new Error(`Missing marketing page for path: ${path}`);
  return page;
}
