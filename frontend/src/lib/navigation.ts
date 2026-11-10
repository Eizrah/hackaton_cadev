import { useEffect, useLayoutEffect, useRef, useState } from "react";
const readRoute = () => window.location.hash.slice(1) || "home";
// pushState évite le saut natif du navigateur lié à un changement de fragment.
export function navigateHash(route: string) {
  if (readRoute() === route) return;
  window.history.pushState({ devafrica: true }, "", `#${route}`);
  window.dispatchEvent(new CustomEvent("devafrica:navigate"));
}
export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);
  const active = useRef(route),
    requested = useRef(route),
    positions = useRef(new Map<string, number>()),
    lastY = useRef(window.scrollY),
    target = useRef(window.scrollY);
  useEffect(() => {
    const old = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const record = () => {
      lastY.current = window.scrollY;
      positions.current.set(active.current, window.scrollY);
    };
    const sync = (restore: boolean) => {
      const next = readRoute();
      if (next === requested.current) return;
      requested.current = next;
      positions.current.set(active.current, lastY.current);
      const learning =
        active.current.startsWith("workspace/apprentissage") &&
        next.startsWith("workspace/apprentissage");
      target.current = restore
        ? (positions.current.get(next) ?? 0)
        : learning
          ? lastY.current
          : 0;
      setRoute(next);
    };
    const push = () => sync(false),
      pop = () => sync(true);
    window.addEventListener("scroll", record, { passive: true });
    window.addEventListener("devafrica:navigate", push);
    window.addEventListener("hashchange", push);
    window.addEventListener("popstate", pop);
    return () => {
      window.removeEventListener("scroll", record);
      window.removeEventListener("devafrica:navigate", push);
      window.removeEventListener("hashchange", push);
      window.removeEventListener("popstate", pop);
      window.history.scrollRestoration = old;
    };
  }, []);
  useLayoutEffect(() => {
    active.current = route;
    window.scrollTo({ top: target.current, behavior: "instant" });
    lastY.current = window.scrollY;
  }, [route]);
  return route;
}
