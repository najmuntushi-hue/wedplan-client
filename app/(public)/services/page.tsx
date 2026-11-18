"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchServices, type Service } from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

function ServicesContent() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchServices({ search, category, location, sort });
        setServices(data);
      } catch (e: any) {
        toast.error(e.message || "Could not load services");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search, category, location, sort]);

  const selectClass = "h-9 rounded-md border bg-white px-3 text-sm";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Browse Wedding Services</h1>
      <p className="mt-1 text-muted-foreground">Find the perfect vendors for your big day</p>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Input placeholder="Location (e.g. Dhaka)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed py-20 text-center">
            <p className="text-lg font-medium">No services found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ServicesContent />
    </Suspense>
  );
}