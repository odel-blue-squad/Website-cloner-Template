"use client";

import { useSyncExternalStore } from "react";

export type SectionTheme = "light" | "dark";

/**
 * scale.com flips the fixed nav between light and dark as sections scroll past.
 * Sections register their theme; the header reads whichever is currently active.
 * Kept outside React state so scroll handlers never trigger a re-render storm.
 */
let theme: SectionTheme = "dark";
const listeners = new Set<() => void>();

export const pageTheme = {
  set(next: SectionTheme) {
    if (next === theme) return;
    theme = next;
    listeners.forEach((l) => l());
  },
  get: () => theme,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function usePageTheme(): SectionTheme {
  return useSyncExternalStore(pageTheme.subscribe, pageTheme.get, () => "dark" as const);
}
