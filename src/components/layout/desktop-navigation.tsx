"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {navigationGroups} from "@/content";
import type {PublicPath} from "@/content";

export function DesktopNavigation({currentPath}: {currentPath?: PublicPath}) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  return (
    <nav aria-label="主导航" className="site-nav hidden xl:block">
      <ul className="flex items-center gap-1">
        {navigationGroups.map((item) => {
          const path = item.kind === "group" ? item.overviewPath : item.path;
          const sectionCurrent = item.kind === "group"
            ? activePath === path || item.children.some((child) => child.path === activePath)
            : activePath === path;
          const currentValue = activePath === path ? "page" : sectionCurrent ? "location" : undefined;

          return (
            <li key={path}>
              <Link
                aria-current={currentValue}
                className="site-nav__link link inline-flex min-h-11 items-center px-3 text-sm font-medium"
                data-current={sectionCurrent || undefined}
                href={path}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
