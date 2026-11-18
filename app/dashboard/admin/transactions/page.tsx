"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { authFetch } from "@/lib/api";

type T = {
  _id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  vendor?: { name: string; email: string; businessName?: string };
};

export default function TransactionsPage() {
  const [tx, setTx] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/admin/transactions")
      .then(setTx)
      .catch((e) => toast.error(e.message || "Could not load transactions"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allow="admin">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : tx.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No transactions yet</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-rose-50 text-xs uppercase">
              <tr>
                <th className="p-3">Vendor</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {tx.map((t) => (
                <tr key={t._id} className="border-b last:border-0">
                  <td className="p-3">
                    <p className="font-medium">{t.vendor?.businessName || t.vendor?.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{t.vendor?.email}</p>
                  </td>
                  <td className="p-3 capitalize">{t.plan}</td>
                  <td className="p-3">
                    {(t.amount / 100).toFixed(2)} {t.currency?.toUpperCase()}
                  </td>
                  <td className="p-3">
                    <Badge className={t.status === "paid" ? "bg-green-600" : t.status === "pending" ? "bg-amber-500" : "bg-red-600"}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-3">{new Date(t.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </RoleGuard>
  );
}