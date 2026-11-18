"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { fetchService, type Service } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BookingForm from "@/components/services/BookingForm";

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!isPending && !session) router.replace("/sign-in");
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetchService(id)
      .then(setService)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, session]);

  const role = (session?.user as any)?.role;

  if (isPending || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!session) return null;
  if (error || !service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Service unavailable</h1>
        <p className="mt-2 text-muted-foreground">{error || "Service not found"}</p>
      </div>
    );
  }

  const vendorName = service.vendor?.businessName || service.vendor?.name || "Vendor";

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <img
          src={service.images?.[active] || "https://placehold.co/1000x600?text=WedPlan"}
          alt={service.serviceName}
          className="h-80 w-full rounded-xl object-cover md:h-[420px]"
        />
        {service.images?.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {service.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActive(i)}
                className={`h-20 w-28 cursor-pointer rounded-md object-cover ${i === active ? "ring-2 ring-rose-600" : ""}`}
              />
            ))}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Badge variant="secondary">{service.category}</Badge>
          <h1 className="text-3xl font-bold">{service.serviceName}</h1>
          <p className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {service.location}
          </p>
          <p className="text-2xl font-bold text-rose-600">৳{service.price.toLocaleString("en-US")}</p>
          <p className="whitespace-pre-line pt-2 text-muted-foreground">{service.description}</p>
          <p className="pt-2 text-sm">
            Vendor: <span className="font-medium">{vendorName}</span>
            {service.vendor?.subscriptionPlan === "premium" && (
              <Badge className="ml-2 bg-amber-500">Premium Vendor</Badge>
            )}
          </p>
        </div>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Book this service</CardTitle>
        </CardHeader>
        <CardContent>
          {role === "customer" ? (
            <BookingForm serviceId={service._id} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Only customers can submit booking requests. You are signed in as {role}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}