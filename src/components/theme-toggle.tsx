"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type ThemeScope = "public" | "admin";
type ThemeMode = "light" | "dark";

const storageKeys: Record<ThemeScope, string> = {
  public: "alberto-public-theme",
  admin: "alberto-admin-theme",
};

export function ThemeToggle({ scope, compact = false, locale = "es" }: { scope: ThemeScope; compact?: boolean; locale?: Locale }) {
  const mode = useSyncExternalStore<ThemeMode>(
    (callback) => subscribeToTheme(scope, callback),
    () => getStoredMode(scope),
    () => "light",
  );

  useEffect(() => {
    applyTheme(scope, mode);
  }, [mode, scope]);

  function toggleTheme() {
    const nextMode = mode === "dark" ? "light" : "dark";
    window.localStorage.setItem(storageKeys[scope], nextMode);
    window.dispatchEvent(new Event(themeEvents[scope]));
    applyTheme(scope, nextMode);
  }

  const Icon = mode === "dark" ? Sun : Moon;
  const publicLabel = locale === "en"
    ? `Switch to ${mode === "dark" ? "light" : "dark"} mode`
    : mode === "dark" ? "Cambiar al modo claro" : "Cambiar al modo oscuro";
  const adminLabel = `Switch admin theme to ${mode === "dark" ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-md border font-extrabold transition ${
        compact
          ? "size-10 border-brand-navy/12 text-brand-navy hover:border-brand-teal hover:text-brand-blue"
          : "h-10 border-white/12 px-3 text-sm text-white/74 hover:bg-white/10 hover:text-white"
      }`}
      aria-label={scope === "public" ? publicLabel : adminLabel}
    >
      <Icon size={17} aria-hidden />
      {!compact && <span>{scope === "public" ? (locale === "en" ? (mode === "dark" ? "Light" : "Dark") : (mode === "dark" ? "Claro" : "Oscuro")) : (mode === "dark" ? "Light" : "Dark")}</span>}
    </button>
  );
}

const themeEvents: Record<ThemeScope, string> = {
  public: "alberto-public-theme-change",
  admin: "alberto-admin-theme-change",
};

function getStoredMode(scope: ThemeScope): ThemeMode {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(storageKeys[scope]) as ThemeMode | null;
  return stored === "dark" ? "dark" : "light";
}

function subscribeToTheme(scope: ThemeScope, callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (!event.key || event.key === storageKeys[scope]) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(themeEvents[scope], callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(themeEvents[scope], callback);
  };
}

function applyTheme(scope: ThemeScope, mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.appSurface = scope;
  root.dataset[`${scope}Theme`] = mode;
}
