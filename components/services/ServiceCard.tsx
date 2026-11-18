import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/api";

export default function ServiceCard({ service }: { service: Service }) {
  const vendorName = service.vendor?.businessName || service.vendor?.name || "Vendor";
  return (
    <Card className="h-full overflow-hidden pt-0">
      <img
        src={service.images?.[0] || "https://placehold.co/800x500?text=WedPlan"}
        alt={service.serviceName}
        className="h-48 w-full object-cover"
      />
      <CardContent className="space-y-3">
        <Badge variant="secondary">{service.category}</Badge>
        <h3 className="text-lg font-semibold">{service.serviceName}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {service.location}
        </p>
        <p className="text-sm text-muted-foreground">By {vendorName}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-rose-600">৳{service.price.toLocaleString("en-US")}</span>
          <Link
            href={`/services/${service._id}`}
            className={cn(buttonVariants({ size: "sm" }), "bg-rose-600 hover:bg-rose-700")}
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}