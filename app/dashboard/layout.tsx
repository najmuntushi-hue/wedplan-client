"use client";

import { useSession } from "@/lib/auth-client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const role = user?.role === "admin" || user?.role === "vendor" ? user.role : "customer";

  return (
    <div className="flex min-h-screen flex-col bg-rose-50/40 md:flex-row">
      {user && <Sidebar role={role} />}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}