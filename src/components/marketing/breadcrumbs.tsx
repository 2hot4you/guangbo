import {Breadcrumbs} from "@heroui/react";
import {getRouteByPath, routeEntries} from "@/content";
import type {PublicPath} from "@/content";

export function MarketingBreadcrumbs({path}: {path: PublicPath}) {
  if (path === "/") return null;

  const parents = routeEntries
    .filter((route) => route.path !== "/" && path.startsWith(`${route.path}/`))
    .sort((a, b) => a.path.length - b.path.length);
  const current = getRouteByPath(path);

  return (
    <nav aria-label="面包屑导航" className="site-container pt-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">{getRouteByPath("/").navLabel}</Breadcrumbs.Item>
        {parents.map((parent) => (
          <Breadcrumbs.Item href={parent.path} key={parent.path}>{parent.navLabel}</Breadcrumbs.Item>
        ))}
        <Breadcrumbs.Item>{current.navLabel}</Breadcrumbs.Item>
      </Breadcrumbs>
    </nav>
  );
}
