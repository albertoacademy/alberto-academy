"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

const preferenceKey = "alberto-site-language";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "es" ? "en" : "es";

  function switchLanguage() {
    const withoutLocale = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
    const destination = `/${nextLocale}${withoutLocale === "/" ? "" : withoutLocale}${window.location.search}${window.location.hash}`;

    window.localStorage.setItem(preferenceKey, nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.assign(destination);
  }

  return (
    <button
      type="button"
      onClick={switchLanguage}
      className="inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-brand-navy/12 px-2.5 text-xs font-extrabold uppercase text-brand-navy transition hover:border-brand-teal hover:text-brand-blue"
      aria-label={locale === "es" ? "Ver el sitio en inglés" : "View website in Spanish"}
      title={locale === "es" ? "English" : "Español"}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
