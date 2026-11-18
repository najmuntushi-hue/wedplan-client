"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { authFetch } from "@/lib/api";

type Stats = { total: number; pending: number; accepted: number; rejected: number };

export default function CustomerOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    authFetch("/customer/stats")
      .then(setStats)
      .catch((e) => toast.error(e.message || "Could not load stats"));
  }, []);

  return (
    <RoleGuard allow="customer">
      <h1 className="text-2xl font-bold">Customer Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats ? (
          <>
            <StatCard label="Total Booking Requests" value={stats.total} />
            <StatCard label="Pending Bookings" value={stats.pending} />
            <StatCard label="Accepted Bookings" value={stats.accepted} />
            <StatCard label="Rejected Bookings" value={stats.rejected} />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        )}
      </div>
    </RoleGuard>
  );
}