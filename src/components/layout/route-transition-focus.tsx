"use client";

import {usePathname} from "next/navigation";
import {useEffect, useRef, useSyncExternalStore} from "react";

const serverNavigation = {href: "", hash: "", revision: 0};
let navigation = serverNavigation;
const navigationListeners = new Set<() => void>();
type HistoryMethod = "pushState" | "replaceState";
const historyPatches = new Map<HistoryMethod, {original: History[HistoryMethod]; wrapper: History[HistoryMethod]}>();

function readNavigation() {
  if (navigation.href !== window.location.href) {
    navigation = {href: window.location.href, hash: window.location.hash, revision: navigation.revision + 1};
  }
  return navigation;
}

function publishNavigation() {
  navigation = {href: window.location.href, hash: window.location.hash, revision: navigation.revision + 1};
  // Next commits history from an insertion effect. Publish the committed URL
  // immediately, but wait until that stack has finished before updating React.
  queueMicrotask(() => {
    for (const listener of [...navigationListeners]) listener();
  });
}

function onAnchorActivation(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
  // A repeated target may not produce a history commit. Treat activation as a
  // new focus request, even when the URL snapshot itself is unchanged.
  if (link.hash && link.href === window.location.href) publishNavigation();
}

function subscribeToNavigation(onChange: () => void) {
  navigationListeners.add(onChange);
  if (navigationListeners.size === 1) {
    for (const method of ["pushState", "replaceState"] as const) {
      if (historyPatches.has(method)) continue;
      const original = window.history[method];
      const wrapper: History[HistoryMethod] = function (this: History, ...args) {
        original.apply(this, args);
        // Notify only after the existing Next/browser implementation commits.
        publishNavigation();
      };
      historyPatches.set(method, {original, wrapper});
      window.history[method] = wrapper;
    }
    window.addEventListener("hashchange", publishNavigation);
    window.addEventListener("popstate", publishNavigation);
    document.addEventListener("click", onAnchorActivation, true);
  }
  return () => {
    navigationListeners.delete(onChange);
    if (navigationListeners.size) return;
    for (const [method, patch] of historyPatches) {
      // Never overwrite a wrapper subsequently installed by Next or another
      // consumer. If ours is in that wrapper's chain, reuse it on resubscribe.
      if (window.history[method] === patch.wrapper) {
        window.history[method] = patch.original;
        historyPatches.delete(method);
      }
    }
    window.removeEventListener("hashchange", publishNavigation);
    window.removeEventListener("popstate", publishNavigation);
    document.removeEventListener("click", onAnchorActivation, true);
  };
}

export function useNavigationHash() {
  return useSyncExternalStore(subscribeToNavigation, () => readNavigation().hash, () => "");
}

export function useNavigationCommit() {
  return useSyncExternalStore(subscribeToNavigation, readNavigation, () => serverNavigation);
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
  const navigation = useNavigationCommit();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const routeChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;
    const targetId = hashTargetId();
    if (targetId) {
      if (window.location.pathname !== pathname) return;
      let frame = 0;
      const observer = new MutationObserver(scheduleFocus);
      function focusTarget() {
        // Keep observing through the Drawer exit animation and focus-scope
        // unmount. Its removal schedules this frame after restore-focus cleanup.
        if (document.querySelector("[data-navigation-drawer]")) return;
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
  }, [pathname, navigation]);

  return null;
}
