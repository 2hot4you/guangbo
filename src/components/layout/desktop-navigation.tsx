"use client";

import {Button, Dropdown} from "@heroui/react";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {navigationGroups} from "@/content";
import type {PublicPath} from "@/content";

function CurrentMarker() {
  return <span className="ml-1 text-xs font-medium">（当前页面）</span>;
}

export function DesktopNavigation({currentPath}: {currentPath?: PublicPath}) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  return (
    <nav aria-label="主导航" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {navigationGroups.map((item) => {
          if (item.kind === "link") {
            const current = activePath === item.path;
            return (
              <li key={item.path}>
                <Link
                  aria-current={current ? "page" : undefined}
                  className="link inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  href={item.path}
                >
                  {item.label}{current && <CurrentMarker />}
                </Link>
              </li>
            );
          }

          const sectionCurrent = activePath === item.overviewPath || item.children.some((child) => child.path === activePath);
          return (
            <li key={item.overviewPath}>
              <Dropdown>
                <Button
                  aria-current={sectionCurrent ? "location" : undefined}
                  aria-label={`${item.label}菜单`}
                  className="min-h-11 px-3 text-sm font-medium"
                  variant="ghost"
                >
                  {item.label}
                  {sectionCurrent && <span className="text-xs">（当前栏目）</span>}
                  <ChevronDown aria-hidden="true" className="size-4" />
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu aria-label={`${item.label}子导航`} className="min-w-56 p-2">
                    {[
                      {label: `${item.label}总览`, path: item.overviewPath},
                      ...item.children,
                    ].map((entry) => {
                      const current = activePath === entry.path;
                      return (
                        <Dropdown.Item
                          className="min-h-11 text-sm"
                          href={entry.path}
                          id={entry.path}
                          key={entry.path}
                          render={(props) => (
                            <Link
                              {...(props as React.ComponentProps<typeof Link>)}
                              aria-current={current ? "page" : undefined}
                              href={entry.path}
                            />
                          )}
                          textValue={entry.label}
                        >
                          {entry.label}{current && <CurrentMarker />}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
