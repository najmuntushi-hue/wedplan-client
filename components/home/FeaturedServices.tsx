"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchServices, type Service } from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices({ limit: "6" })
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Featured Wedding Services</h2>
        <p className="mt-2 text-muted-foreground">Handpicked services from top-rated vendors</p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="text-center text-muted-foreground">No services available yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <ServiceCard service={s} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}