import { AppShell } from "@/components/app/AppShell";
import "../app.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell variant="admin">{children}</AppShell>;
}
