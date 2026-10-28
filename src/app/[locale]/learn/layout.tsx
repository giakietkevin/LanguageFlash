import { AppShell } from "@/components/app/AppShell";
import "../app.css";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <AppShell variant="learn">{children}</AppShell>;
}
