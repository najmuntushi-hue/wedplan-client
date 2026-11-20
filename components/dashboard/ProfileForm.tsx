"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { authFetch, uploadImage } from "@/lib/api";

type Me = {
  name: string;
  email: string;
  image?: string;
  role: string;
  businessName?: string;
  subscriptionPlan?: string;
};

export default function ProfileForm() {
  const [me, setMe] = useState<Me | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authFetch("/users/me")
      .then(setMe)
      .catch((e) => toast.error(e.message || "Could not load profile"));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const businessName = String(f.get("businessName") || "").trim();
    if (name.length < 2) return toast.error("Name must be at least 2 characters");

    setSaving(true);
    try {
      const body: Record<string, string> = { name };
      if (me?.role === "vendor") body.businessName = businessName;
      if (file) body.image = await uploadImage(file);

      await authFetch("/users/me", { method: "PATCH", body: JSON.stringify(body) });
      toast.success("Profile updated successfully");
      setFile(null);
      setMe(await authFetch("/users/me"));
      await authClient.getSession({ query: { disableCookieCache: true } });
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  if (!me) return <Skeleton className="h-72 max-w-xl" />;

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-xl border bg-white p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={me.image || undefined} alt={me.name} />
          <AvatarFallback>{me.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{me.email}</p>
          <p className="text-sm capitalize text-muted-foreground">
            {me.role} • {me.subscriptionPlan || "free"} plan
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" defaultValue={me.name} required />
      </div>

      {me.role === "vendor" && (
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input id="businessName" name="businessName" defaultValue={me.businessName || ""} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="image">Profile Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>

      <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}