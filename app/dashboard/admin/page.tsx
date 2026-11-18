"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { authFetch } from "@/lib/api";

type Stats = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    authFetch("/admin/stats")
      .then(setStats)
      .catch((e) => toast.error(e.message || "Could not load stats"));
  }, []);

  return (
    <RoleGuard allow="admin">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats ? (
          <>
            <StatCard label="Total Registered Users" value={stats.totalUsers} />
            <StatCard label="Total Vendors" value={stats.totalVendors} />
            <StatCard label="Total Customers" value={stats.totalCustomers} />
            <StatCard label="Total Services" value={stats.totalServices} />
            <StatCard label="Pending Services" value={stats.pendingServices} />
            <StatCard label="Total Transactions" value={stats.totalTransactions} />
          </>
        ) : (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        )}
      </div>
    </RoleGuard>
  );
}