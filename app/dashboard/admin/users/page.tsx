"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authFetch } from "@/lib/api";

type U = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: string;
  createdAt?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selected, setSelected] = useState<U | null>(null);
  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      if (role) qs.set("role", role);
      setUsers(await authFetch(`/admin/users?${qs.toString()}`));
    } catch (e: any) {
      toast.error(e.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role]);

  async function toggleBlock(u: U) {
    setBusyId(u._id);
    try {
      await authFetch(`/admin/users/${u._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ blocked: !u.isBlocked }),
      });
      toast.success(u.isBlocked ? "User unblocked" : "User blocked");
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <RoleGuard allow="admin">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-md border bg-white px-3 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : users.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No users found</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-rose-50 text-xs uppercase">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    <Badge className={u.isBlocked ? "bg-red-600" : "bg-green-600"}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </td>
                  <td className="space-x-2 p-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelected(u)}>
                      View
                    </Button>
                    {u.role !== "admin" && (
                      <Button
                        size="sm"
                        variant={u.isBlocked ? "outline" : "destructive"}
                        disabled={busyId === u._id}
                        onClick={() => toggleBlock(u)}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {selected.name}</p>
              <p><span className="font-medium">Email:</span> {selected.email}</p>
              <p><span className="font-medium">Role:</span> <span className="capitalize">{selected.role}</span></p>
              {selected.businessName && (
                <p><span className="font-medium">Business:</span> {selected.businessName}</p>
              )}
              <p><span className="font-medium">Plan:</span> <span className="capitalize">{selected.subscriptionPlan || "free"}</span></p>
              <p><span className="font-medium">Status:</span> {selected.isBlocked ? "Blocked" : "Active"}</p>
              {selected.createdAt && (
                <p><span className="font-medium">Joined:</span> {new Date(selected.createdAt).toLocaleDateString("en-GB")}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}