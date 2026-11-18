"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authFetch, uploadImage } from "@/lib/api";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const serviceName = String(f.get("serviceName")).trim();
    const category = String(f.get("category"));
    const description = String(f.get("description")).trim();
    const price = Number(f.get("price"));
    const location = String(f.get("location")).trim();

    if (!serviceName || !category || !description || !location || !(price > 0)) {
      return toast.error("Please fill in all required fields");
    }
    if (files.length === 0) return toast.error("Please upload at least one image");

    setLoading(true);
    try {
      const images: string[] = [];
      for (const file of files.slice(0, 5)) images.push(await uploadImage(file));

      await authFetch("/vendor/services", {
        method: "POST",
        body: JSON.stringify({ serviceName, category, description, price, location, images }),
      });
      toast.success("Service submitted for admin approval");
      router.push("/dashboard/vendor/services");
    } catch (err: any) {
      toast.error(err.message || "Could not add service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RoleGuard allow="vendor">
      <h1 className="text-2xl font-bold">Add Service</h1>
      <form onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-4 rounded-xl border bg-white p-6">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Service Name</Label>
          <Input id="serviceName" name="serviceName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" name="category" required className="h-9 w-full rounded-md border bg-white px-3 text-sm">
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price (৳)</Label>
            <Input id="price" name="price" type="number" min="1" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="images">Service Images (up to 5)</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          {files.length > 0 && <p className="text-xs text-muted-foreground">{files.length} image(s) selected</p>}
        </div>
        <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={loading}>
          {loading ? "Uploading & saving..." : "Submit Service"}
        </Button>
      </form>
    </RoleGuard>
  );
}