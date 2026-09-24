"use client";

import {Button, Drawer} from "@heroui/react";
import {ChevronDown, Menu} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {getNavigationHref, navigationGroups} from "@/content";
import type {PublicPath} from "@/content";
import {useNavigationCommit} from "./route-transition-focus";

export function MobileNavigation({currentPath}: {currentPath?: PublicPath}) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;
  const navigation = useNavigationCommit();
  return <MobileNavigationContent activePath={activePath} hash={navigation.hash} revision={navigation.revision} key={`${pathname}:${activePath}`} />;
}

function MobileNavigationContent({activePath, hash, revision}: {activePath: string; hash: string; revision: number}) {
  const [openRevision, setOpenRevision] = useState<number | null>(null);
  const isOpen = openRevision === revision;
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const currentGroup = navigationGroups.find(
      (item) => item.kind === "group" && (item.overviewPath === activePath || item.columns.some((column) => column.links.some((child) => child.path === activePath))),
    );
    return currentGroup?.kind === "group" ? {[currentGroup.overviewPath]: true} : {};
  });

  function closeMenu() {
    setOpenRevision(null);
  }

  return (
    <div className="xl:hidden">
      <Button
        aria-label="打开导航菜单"
        className="min-h-11 min-w-11"
        isIconOnly
        onPress={() => setOpenRevision(revision)}
        variant="ghost"
      >
        <Menu aria-hidden="true" className="size-5" />
      </Button>
      <Drawer.Backdrop isOpen={isOpen} onOpenChange={(open) => setOpenRevision(open ? revision : null)}>
        <Drawer.Content placement="right">
          <Drawer.Dialog aria-label="网站导航" className="w-full max-w-sm" data-navigation-drawer>
            <Drawer.CloseTrigger aria-label="关闭导航菜单" />
            <Drawer.Header>
              <Drawer.Heading>网站导航</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav aria-label="移动导航">
                <ul className="space-y-1">
                  {navigationGroups.map((item) => {
                    if (item.kind === "link") {
                      const current = activePath === item.path;
                      return (
                        <li key={item.path}>
                          <Link
                            aria-current={current ? "page" : undefined}
                            className="mobile-nav__link link flex min-h-11 items-center px-3"
                            data-current={current || undefined}
                            href={item.path}
                            onClick={closeMenu}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    }

                    const isExpanded = Boolean(expanded[item.overviewPath]);
                    const overviewCurrent = activePath === item.overviewPath;
                    return (
                      <li key={item.overviewPath}>
                        <div className="flex items-center gap-1">
                          <Link
                            aria-current={overviewCurrent ? "page" : undefined}
                            className="mobile-nav__link link flex min-h-11 min-w-0 flex-1 items-center px-3"
                            data-current={overviewCurrent || undefined}
                            href={item.overviewPath}
                            onClick={closeMenu}
                          >
                            {item.label}
                          </Link>
                          <Button
                            aria-controls={`mobile-children-${item.overviewPath.slice(1)}`}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? "收起" : "展开"}${item.label}子菜单`}
                            className="min-h-11 min-w-11"
                            isIconOnly
                            onPress={() => setExpanded((previous) => ({...previous, [item.overviewPath]: !isExpanded}))}
                            variant="ghost"
                          >
                            <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </Button>
                        </div>
                        <div
                          className="ml-4 border-l border-divider pl-2"
                          hidden={!isExpanded}
                          id={`mobile-children-${item.overviewPath.slice(1)}`}
                        >
                          {item.columns.map((column) => (
                            <div key={column.heading}>
                              <h3 className="px-3 pt-4 pb-1 text-xs font-semibold text-muted">{column.heading}</h3>
                              <ul>
                                {column.links.map((child) => {
                                  const href = getNavigationHref(child);
                                  const current = activePath === child.path && (!child.sectionId || hash === `#${child.sectionId}`);
                                  return (
                                    <li key={href}>
                                      <Link
                                        aria-current={current ? child.sectionId ? "location" : "page" : undefined}
                                        className="mobile-nav__link link flex min-h-11 items-center px-3 text-sm"
                                        data-current={current || undefined}
                                        href={href}
                                        onClick={closeMenu}
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </div>
  );
}
