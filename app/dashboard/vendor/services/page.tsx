"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authFetch, type Service } from "@/lib/api";

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

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      setServices(await authFetch("/vendor/services"));
    } catch (e: any) {
      toast.error(e.message || "Could not load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string) {
    setBusyId(id);
    try {
      await authFetch(`/vendor/services/${id}/availability`, { method: "PATCH" });
      toast.success("Availability updated");
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
      await authFetch(`/vendor/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await authFetch(`/vendor/services/${editing._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          serviceName: String(f.get("serviceName")).trim(),
          category: String(f.get("category")),
          description: String(f.get("description")).trim(),
          price: Number(f.get("price")),
          location: String(f.get("location")).trim(),
        }),
      });
      toast.success("Service updated and sent for review");
      setEditing(null);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <RoleGuard allow="vendor">
      <h1 className="text-2xl font-bold">My Services</h1>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white py-16 text-center">
            <p className="font-medium">You have not added any services yet</p>
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
                <div className="flex gap-2">
                  <Badge className={`capitalize ${statusColor[s.status] || "bg-gray-500"}`}>{s.status}</Badge>
                  <Badge variant="outline">{s.isActive ? "Available" : "Unavailable"}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={busyId === s._id} onClick={() => toggle(s._id)}>
                  {s.isActive ? "Set Unavailable" : "Set Available"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(s)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" disabled={busyId === s._id} onClick={() => remove(s._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={saveEdit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input id="serviceName" name="serviceName" defaultValue={editing.serviceName} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={editing.category}
                  className="h-9 w-full rounded-md border bg-white px-3 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={editing.description} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="price">Price (৳)</Label>
                  <Input id="price" name="price" type="number" min="1" defaultValue={editing.price} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" defaultValue={editing.location} required />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Edited services are sent for admin review again.</p>
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}