import {routeEntries} from "./routes";
import type {PageKey, PublicPath} from "./types";

export interface NavigationLink {
  kind: "link";
  label: string;
  path: PublicPath;
  overviewPath?: never;
  children?: never;
}

export interface NavigationSection {
  kind: "group";
  label: string;
  overviewPath: PublicPath;
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

function group(key: PageKey, children: readonly PageKey[]): NavigationSection {
  const route = routeForKey(key);
  return {
    kind: "group",
    label: route.navLabel,
    overviewPath: route.path,
    children: children.map(link),
  };
}

export const navigationGroups: readonly NavigationItem[] = [
  group("ai", ["aiLlm", "aiImage", "aiVideo"]),
  group("idc", ["idcVps", "idcBareMetal", "idcColocation", "idcGpu"]),
  link("madeInChina"),
  link("network"),
  link("energy"),
  link("about"),
];
