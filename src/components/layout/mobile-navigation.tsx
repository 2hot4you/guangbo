"use client";

import {Button, Drawer} from "@heroui/react";
import {ChevronDown, Menu} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {navigationGroups, routeEntries} from "@/content";
import type {PublicPath} from "@/content";

function CurrentMarker() {
  return <span className="ml-1 text-xs font-medium">（当前页面）</span>;
}

export function MobileNavigation({currentPath}: {currentPath?: PublicPath}) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  return <MobileNavigationContent activePath={activePath} key={`${pathname}:${activePath}`} />;
}

function MobileNavigationContent({activePath}: {activePath: string}) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const currentGroup = navigationGroups.find(
      (item) => item.kind === "group" && item.children.some((child) => child.path === activePath),
    );
    return currentGroup?.kind === "group" ? {[currentGroup.overviewPath]: true} : {};
  });

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="xl:hidden">
      <Button
        aria-label="打开导航菜单"
        className="min-h-11 min-w-11"
        isIconOnly
        onPress={() => setIsOpen(true)}
        variant="ghost"
      >
        <Menu aria-hidden="true" className="size-5" />
      </Button>
      <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog aria-label="网站导航" className="w-full max-w-sm">
            <Drawer.CloseTrigger aria-label="关闭导航菜单" />
            <Drawer.Header>
              <Drawer.Heading>网站导航</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav aria-label="移动导航">
                <ul className="space-y-1">
                  <li>
                    <Link
                      aria-current={activePath === "/" ? "page" : undefined}
                      className="link flex min-h-11 items-center rounded-lg px-3 text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                      href={routeEntries[0].path}
                      onClick={closeMenu}
                    >
                      首页{activePath === "/" && <CurrentMarker />}
                    </Link>
                  </li>
                  {navigationGroups.map((item) => {
                    if (item.kind === "link") {
                      const current = activePath === item.path;
                      return (
                        <li key={item.path}>
                          <Link
                            aria-current={current ? "page" : undefined}
                            className="link flex min-h-11 items-center rounded-lg px-3 text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                            href={item.path}
                            onClick={closeMenu}
                          >
                            {item.label}{current && <CurrentMarker />}
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
                            className="link flex min-h-11 min-w-0 flex-1 items-center rounded-lg px-3 text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                            href={item.overviewPath}
                            onClick={closeMenu}
                          >
                            {item.label}总览{overviewCurrent && <CurrentMarker />}
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
                        <ul
                          className="ml-4 border-l border-divider pl-2"
                          hidden={!isExpanded}
                          id={`mobile-children-${item.overviewPath.slice(1)}`}
                        >
                            {item.children.map((child) => {
                              const current = activePath === child.path;
                              return (
                                <li key={child.path}>
                                  <Link
                                    aria-current={current ? "page" : undefined}
                                    className="link flex min-h-11 items-center rounded-lg px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                                    href={child.path}
                                    onClick={closeMenu}
                                  >
                                    {child.label}{current && <CurrentMarker />}
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
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
