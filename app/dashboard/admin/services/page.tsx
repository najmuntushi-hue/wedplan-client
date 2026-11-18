"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { authFetch } from "@/lib/api";

type S = {
  _id: string;
  serviceName: string;
  category: string;
  price: number;
  location: string;
  images?: string[];
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  vendor?: { name: string; businessName?: string };
};

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500",
  approved: "bg-green-600",
  rejected: "bg-red-600",
};

export default function ManageServicesPage() {
  const [services, setServices] = useState<S[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      if (status) qs.set("status", status);
      if (category) qs.set("category", category);
      setServices(await authFetch(`/admin/services?${qs.toString()}`));
    } catch (e: any) {
      toast.error(e.message || "Could not load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, category]);

  async function setServiceStatus(id: string, next: string) {
    setBusyId(id);
    try {
      await authFetch(`/admin/services/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success(`Service ${next}`);
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this service permanently?")) return;
    setBusyId(id);
    try {
      await authFetch(`/admin/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <RoleGuard allow="admin">
      <h1 className="text-2xl font-bold">Manage Services</h1>

      <div className="mt-6 grid gap-3 md:grid-cols-3 lg:max-w-4xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by service name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="h-9 rounded-md border bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select className="h-9 rounded-md border bg-white px-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white py-16 text-center">
            <p className="font-medium">No services found</p>
          </div>
        ) : (
          services.map((s) => (
            <div key={s._id} className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center">
              <img
                src={s.images?.[0] || "https://placehold.co/200x140?text=WedPlan"}
                alt=""
                className="h-24 w-full rounded-md object-cover sm:w-36"
              />
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">{s.serviceName}</h3>
                <p className="text-sm text-muted-foreground">
                  {s.category} • {s.location} • ৳{s.price.toLocaleString("en-US")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Vendor: {s.vendor?.businessName || s.vendor?.name || "N/A"}
                </p>
                <div className="flex gap-2">
                  <Badge className={`capitalize ${statusColor[s.status]}`}>{s.status}</Badge>
                  <Badge variant="outline">{s.isActive ? "Available" : "Unavailable"}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.status !== "approved" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={busyId === s._id}
                    onClick={() => setServiceStatus(s._id, "approved")}
                  >
                    Approve
                  </Button>
                )}
                {s.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === s._id}
                    onClick={() => setServiceStatus(s._id, "rejected")}
                  >
                    Reject
                  </Button>
                )}
                <Button size="sm" variant="destructive" disabled={busyId === s._id} onClick={() => remove(s._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </RoleGuard>
  );
}