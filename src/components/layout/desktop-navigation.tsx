"use client";

import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {getNavigationHref, navigationGroups} from "@/content";
import type {PublicPath} from "@/content";
import {useNavigationHash} from "./route-transition-focus";

export function DesktopNavigation({currentPath}: {currentPath?: PublicPath}) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;
  const hash = useNavigationHash();
  return <DesktopNavigationContent activePath={activePath} hash={hash} key={`${pathname}:${activePath}:${hash}`} />;
}

function DesktopNavigationContent({activePath, hash}: {activePath: string; hash: string}) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returningFocus = useRef(false);
  const pointerFocus = useRef(false);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  function cancelClose() {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function open(path: string) {
    cancelClose();
    setOpenPath(path);
  }

  function close() {
    cancelClose();
    setOpenPath(null);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenPath(null), 180);
  }

  useEffect(() => () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!openPath) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      setOpenPath(null);
      returningFocus.current = true;
      buttons.current[openPath!]?.focus();
      returningFocus.current = false;
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [openPath]);

  return (
    <nav
      aria-label="主导航"
      className="site-nav hidden xl:block"
      onKeyDownCapture={() => { pointerFocus.current = false; }}
    >
      <ul className="flex items-center gap-1">
        {navigationGroups.map((item) => {
          const path = item.kind === "group" ? item.overviewPath : item.path;
          const sectionCurrent = item.kind === "group"
            ? activePath === path || item.columns.some((column) => column.links.some((child) => child.path === activePath))
            : activePath === path;
          const currentValue = activePath === path ? "page" : sectionCurrent ? "location" : undefined;
          const isOpen = openPath === path;
          const panelId = `desktop-panel-${path.slice(1)}`;

          return (
            <li
              key={path}
              className="site-nav__group"
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return;
                if (item.kind === "group") open(path);
                else close();
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") scheduleClose();
              }}
              onFocus={() => {
                if (!returningFocus.current && !pointerFocus.current) {
                  if (item.kind === "group") open(path);
                  else close();
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose();
              }}
            >
              <div className="flex items-center">
                <Link
                  aria-current={currentValue}
                  className="site-nav__link link inline-flex min-h-11 items-center px-2 text-sm font-medium"
                  data-current={sectionCurrent || undefined}
                  href={path}
                  onClick={close}
                >
                  {item.label}
                </Link>
                {item.kind === "group" && (
                  <button
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "收起" : "展开"}${item.label}子菜单`}
                    className="site-nav__trigger inline-flex min-h-11 w-6 items-center justify-center"
                    onPointerDown={() => { pointerFocus.current = true; }}
                    onPointerCancel={() => { pointerFocus.current = false; }}
                    onClick={() => {
                      // Touch compatibility focus follows pointerup, before click.
                      pointerFocus.current = false;
                      if (isOpen) close();
                      else open(path);
                    }}
                    ref={(button) => { buttons.current[path] = button; }}
                    type="button"
                  >
                    <ChevronDown aria-hidden="true" className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
              {item.kind === "group" && (
                <div
                  aria-hidden={!isOpen}
                  className="site-nav__panel"
                  id={panelId}
                  inert={!isOpen}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") open(path);
                  }}
                  style={{visibility: isOpen ? "visible" : "hidden", pointerEvents: isOpen ? "auto" : "none"}}
                >
                  <div className="site-container site-nav__columns">
                    {item.columns.map((column) => (
                      <div key={column.heading}>
                        <h2 className="site-nav__heading">{column.heading}</h2>
                        <ul>
                          {column.links.map((child) => {
                            const href = getNavigationHref(child);
                            const current = activePath === child.path && (!child.sectionId || hash === `#${child.sectionId}`);
                            return (
                              <li key={href}>
                                <Link
                                  aria-current={current ? child.sectionId ? "location" : "page" : undefined}
                                  className="site-nav__item link"
                                  data-current={current || undefined}
                                  href={href}
                                  onClick={close}
                                  tabIndex={isOpen ? undefined : -1}
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
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
