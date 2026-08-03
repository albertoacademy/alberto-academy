import type { Metadata } from "next";
import { localeAlternates, localePath, type Locale } from "@/lib/i18n";

const socialImages = [
  {
    url: "/images/alberto-academy-og.jpg",
    width: 1200,
    height: 630,
    alt: "Alberto Academy",
    type: "image/jpeg",
  },
  {
    url: "/images/alberto-academy-og.png",
    width: 1731,
    height: 909,
    alt: "Alberto Academy",
    type: "image/png",
  },
];

export function createLocalizedMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: localePath(locale, path),
      siteName: "Alberto Academy",
      images: socialImages,
      locale: locale === "en" ? "en_US" : "es_DO",
      alternateLocale: [locale === "en" ? "es_DO" : "en_US"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/alberto-academy-og.jpg"],
    },
  };
}
