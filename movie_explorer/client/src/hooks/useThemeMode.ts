import { useSyncExternalStore } from "react";

type Mode = "dark" | "light";

const KEY = "theme-mode";
const listeners = new Set<() => void>();

let mode: Mode = localStorage.getItem(KEY) === "light" ? "light" : "dark";

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function toggle() {
  mode = mode === "dark" ? "light" : "dark";
  localStorage.setItem(KEY, mode);
  listeners.forEach((l) => l());
}

/** Theme mode shared across all components (same store pattern as useWatchlist). Default: dark. */
export function useThemeMode() {
  const current = useSyncExternalStore(subscribe, () => mode);
  return { mode: current, toggle };
}
