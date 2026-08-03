import "server-only";

import { headers } from "next/headers";
import type { Locale } from "@/lib/i18n";

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  return requestHeaders.get("x-alberto-locale") === "en" ? "en" : "es";
}
