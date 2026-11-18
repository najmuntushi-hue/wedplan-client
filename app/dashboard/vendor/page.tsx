"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { authFetch } from "@/lib/api";

type Stats = {
  totalServices: number;
  activeServices: number;
  pendingBookings: number;
  acceptedBookings: number;
  plan: string;
};

export default function VendorOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    authFetch("/vendor/stats")
      .then(setStats)
      .catch((e) => toast.error(e.message || "Could not load stats"));
  }, []);

  return (
    <RoleGuard allow="vendor">
      <h1 className="text-2xl font-bold">Vendor Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats ? (
          <>
            <StatCard label="Total Services" value={stats.totalServices} />
            <StatCard label="Active Services" value={stats.activeServices} />
            <StatCard label="Pending Booking Requests" value={stats.pendingBookings} />
            <StatCard label="Accepted Bookings" value={stats.acceptedBookings} />
            <StatCard label="Current Plan" value={stats.plan === "premium" ? "Premium" : "Free"} />
          </>
        ) : (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        )}
      </div>
    </RoleGuard>
  );
}