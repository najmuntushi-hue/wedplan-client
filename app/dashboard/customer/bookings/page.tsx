"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { authFetch } from "@/lib/api";

type Booking = {
  _id: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  service?: { serviceName: string; images?: string[]; price: number; category: string };
  vendor?: { name: string; businessName?: string };
};

const statusColor: Record<string, string> = {
  pending: "bg-amber-500",
  accepted: "bg-green-600",
  rejected: "bg-red-600",
  cancelled: "bg-gray-500",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      setBookings(await authFetch("/bookings/mine"));
    } catch (e: any) {
      toast.error(e.message || "Could not load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(id: string) {
    setBusyId(id);
    try {
      await authFetch(`/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Could not cancel booking");
    } finally {
      setBusyId("");
    }
  }

  return (
    <RoleGuard allow="customer">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white py-16 text-center">
            <p className="font-medium">No booking requests yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse services and send your first request.</p>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center">
              <img
                src={b.service?.images?.[0] || "https://placehold.co/200x140?text=WedPlan"}
                alt=""
                className="h-24 w-full rounded-md object-cover sm:w-36"
              />
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">{b.service?.serviceName || "Service removed"}</h3>
                <p className="text-sm text-muted-foreground">
                  Vendor: {b.vendor?.businessName || b.vendor?.name || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Event: {fmt(b.eventDate)} • {b.eventLocation}
                </p>
                <p className="text-xs text-muted-foreground">Requested on {fmt(b.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <Badge className={`capitalize ${statusColor[b.status]}`}>{b.status}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelected(b)}>
                    Details
                  </Button>
                  {b.status === "pending" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busyId === b._id}
                      onClick={() => cancel(b._id)}
                    >
                      {busyId === b._id ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Service:</span> {selected.service?.serviceName}</p>
              <p><span className="font-medium">Category:</span> {selected.service?.category}</p>
              <p><span className="font-medium">Vendor:</span> {selected.vendor?.businessName || selected.vendor?.name}</p>
              <p><span className="font-medium">Event Date:</span> {fmt(selected.eventDate)}</p>
              <p><span className="font-medium">Event Location:</span> {selected.eventLocation}</p>
              <p><span className="font-medium">Message:</span> {selected.message || "None"}</p>
              <p><span className="font-medium">Status:</span> <span className="capitalize">{selected.status}</span></p>
              <p><span className="font-medium">Requested on:</span> {fmt(selected.createdAt)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}