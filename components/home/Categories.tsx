"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Camera, Building2, Flower2, UtensilsCrossed, Sparkles, Shirt } from "lucide-react";

const categories = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: Building2 },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: UtensilsCrossed },
  { name: "Makeup & Styling", icon: Sparkles },
  { name: "Wedding Fashion", icon: Shirt },
];

export default function Categories() {
  return (
    <section className="bg-rose-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Wedding Service Categories</h2>
          <p className="mt-2 text-muted-foreground">Explore services by category</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/services?category=${encodeURIComponent(c.name)}`}
                className="flex h-full flex-col items-center gap-3 rounded-xl border bg-white p-6 text-center transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-md"
              >
                <c.icon className="h-8 w-8 text-rose-600" />
                <span className="text-sm font-medium">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}