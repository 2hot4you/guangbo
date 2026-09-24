"use client";

import {usePathname} from "next/navigation";
import {useEffect, useRef} from "react";

export function RouteTransitionFocus() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    document.getElementById("main-content")?.focus({preventScroll: true});
    window.scrollTo({left: 0, top: 0, behavior: "auto"});
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({left: 0, top: 0, behavior: "auto"});
      root.style.scrollBehavior = previousBehavior;
    });
    return () => {
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [pathname]);

  return null;
}
