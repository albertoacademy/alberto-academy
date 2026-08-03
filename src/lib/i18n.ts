export type Locale = "es" | "en";

export const defaultLocale: Locale = "es";
export const locales: Locale[] = ["es", "en"];

export function isLocale(value: string | undefined): value is Locale {
  return value === "es" || value === "en";
}

export function localePath(locale: Locale, path = "/") {
  if (path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("tel:") || path.startsWith("http")) {
    return path;
  }

  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function localeAlternates(locale: Locale, path = "/") {
  return {
    canonical: localePath(locale, path),
    languages: {
      es: localePath("es", path),
      en: localePath("en", path),
      "x-default": localePath(defaultLocale, path),
    },
  };
}
