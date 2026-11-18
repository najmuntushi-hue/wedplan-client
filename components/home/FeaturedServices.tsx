"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sample = [
  { id: "1", name: "Cinematic Wedding Photography", category: "Photography & Videography", price: 45000, location: "Dhaka", vendor: "Lens & Light Studio", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80" },
  { id: "2", name: "Grand Ballroom Venue", category: "Wedding Venues", price: 150000, location: "Sylhet", vendor: "Royal Palace Hall", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80" },
  { id: "3", name: "Floral Stage Decoration", category: "Decoration & Florist", price: 60000, location: "Chittagong", vendor: "Bloom Decor", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=800&q=80" },
  { id: "4", name: "Traditional Catering Package", category: "Catering Services", price: 900, location: "Dhaka", vendor: "Spice Garden Catering", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80" },
  { id: "5", name: "Bridal Makeup & Styling", category: "Makeup & Styling", price: 25000, location: "Sylhet", vendor: "Glow Beauty Studio", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80" },
  { id: "6", name: "Designer Bridal Lehenga", category: "Wedding Fashion", price: 80000, location: "Dhaka", vendor: "Elegance Boutique", image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80" },
];

export default function FeaturedServices() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Featured Wedding Services</h2>
        <p className="mt-2 text-muted-foreground">Handpicked services from top-rated vendors</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sample.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Card className="h-full overflow-hidden pt-0">
              <img src={s.image} alt={s.name} className="h-48 w-full object-cover" />
              <CardContent className="space-y-3">
                <Badge variant="secondary">{s.category}</Badge>
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {s.location}
                </p>
                <p className="text-sm text-muted-foreground">By {s.vendor}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-rose-600">৳{s.price.toLocaleString("en-US")}</span>
                  <Link
                    href={`/services/${s.id}`}
                    className={cn(buttonVariants({ size: "sm" }), "bg-rose-600 hover:bg-rose-700")}
                  >
                    View Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}