import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/admin-panel";
import { getRequestLocale } from "@/lib/i18n-server";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createLocalizedMetadata({
    locale,
    path: "/login",
    title: "Login | Alberto Academy",
    description: "Alberto Academy admin login preview.",
  });
}

export default function LoginPage() {
  return <AdminLogin />;
}
