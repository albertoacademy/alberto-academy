import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/admin-panel";

export const metadata: Metadata = {
  title: "Admin | Alberto Academy",
  description: "Alberto Academy internal admin panel for leads and enrolled students.",
};

export default function AdminPage() {
  return <AdminPanel />;
}
