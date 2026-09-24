"use client";

import {usePathname} from "next/navigation";
import {useEffect, useRef, useSyncExternalStore} from "react";

function subscribeToHash(onChange: () => void) {
  let frame = 0;
  function afterLinkClick(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(link instanceof HTMLAnchorElement) || link.origin !== window.location.origin || link.target === "_blank") return;
    // Next Link updates history without a native hashchange event.
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(onChange);
  }
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  document.addEventListener("click", afterLinkClick);
  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    document.removeEventListener("click", afterLinkClick);
  };
}

export function useNavigationHash() {
  return useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
}

function hashTargetId() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return "";
  }
}

export function RouteTransitionFocus() {
  const pathname = usePathname();
  const hash = useNavigationHash();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const routeChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;
    const targetId = hashTargetId();
    if (targetId) {
      let frame = 0;
      const observer = new MutationObserver(scheduleFocus);
      function focusTarget() {
        const target = document.getElementById(targetId);
        if (!target) return;
        observer.disconnect();
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.focus({preventScroll: true});
        target.scrollIntoView({block: "start", behavior: "auto"});
        root.style.scrollBehavior = previousBehavior;
      }
      function scheduleFocus() {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(focusTarget);
      }
      observer.observe(document.body, {childList: true, subtree: true});
      scheduleFocus();
      return () => {
        window.cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }
    if (!routeChanged) return;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    document.getElementById("main-content")?.focus({preventScroll: true});
    window.scrollTo({left: 0, top: 0, behavior: "auto"});
    const frame = window.requestAnimationFrame(() => {
      if (!hashTargetId()) window.scrollTo({left: 0, top: 0, behavior: "auto"});
      root.style.scrollBehavior = previousBehavior;
    });
    return () => {
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [pathname, hash]);

  return null;
}
