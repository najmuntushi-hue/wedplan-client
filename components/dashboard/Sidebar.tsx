"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Briefcase, PlusCircle, CalendarCheck, CreditCard,
  UserCog, Users, ListChecks, Receipt, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "vendor" | "customer" | "admin";

const menus: Record<Role, { href: string; label: string; icon: any }[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/services", label: "My Services", icon: Briefcase },
    { href: "/dashboard/vendor/services/add", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/vendor/bookings", label: "Booking Requests", icon: CalendarCheck },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: CreditCard },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: UserCog },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/customer/profile", label: "Profile Settings", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: ListChecks },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
  ],
};

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 border-b bg-white md:w-64 md:border-b-0 md:border-r">
      <div className="p-4">
        <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold text-rose-600">
          <Heart className="h-5 w-5 fill-rose-600" /> WedPlan
        </Link>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {role} dashboard
        </p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {menus[role].map((m) => {
            const active = pathname === m.href;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-rose-50",
                  active && "bg-rose-100 text-rose-700"
                )}
              >
                <m.icon className="h-4 w-4" /> {m.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}