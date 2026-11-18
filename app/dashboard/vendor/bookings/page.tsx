"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authFetch } from "@/lib/api";

type Booking = {
  _id: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  service?: { serviceName: string; images?: string[]; price: number };
  customer?: { name: string; email: string; image?: string };
};

const statusColor: Record<string, string> = {
  pending: "bg-amber-500",
  accepted: "bg-green-600",
  rejected: "bg-red-600",
  cancelled: "bg-gray-500",
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      setBookings(await authFetch("/bookings/vendor"));
    } catch (e: any) {
      toast.error(e.message || "Could not load booking requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: string, status: "accepted" | "rejected") {
    setBusyId(id);
    try {
      await authFetch(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking ${status}`);
      await load();
    } catch (e: any) {
      toast.error(e.message || "Could not update booking");
    } finally {
      setBusyId("");
    }
  }

  return (
    <RoleGuard allow="vendor">
      <h1 className="text-2xl font-bold">Booking Requests</h1>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white py-16 text-center">
            <p className="font-medium">No booking requests yet</p>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center">
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">{b.service?.serviceName || "Service removed"}</h3>
                <p className="text-sm">
                  Customer: <span className="font-medium">{b.customer?.name}</span>{" "}
                  <span className="text-muted-foreground">({b.customer?.email})</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Event: {fmt(b.eventDate)} • {b.eventLocation}
                </p>
                <p className="text-sm text-muted-foreground">Message: {b.message || "None"}</p>
                <p className="text-xs text-muted-foreground">Requested on {fmt(b.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <Badge className={`capitalize ${statusColor[b.status]}`}>{b.status}</Badge>
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={busyId === b._id}
                      onClick={() => update(b._id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busyId === b._id}
                      onClick={() => update(b._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </RoleGuard>
  );
}