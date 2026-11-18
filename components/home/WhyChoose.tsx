"use client";

import { motion } from "motion/react";
import { ShieldCheck, Search, CalendarCheck, BadgeDollarSign } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Verified Vendors", text: "Every published service is reviewed and approved by our admin team." },
  { icon: Search, title: "Easy Discovery", text: "Search and filter by category, location and price to find the right fit." },
  { icon: CalendarCheck, title: "Simple Booking", text: "Send booking requests and track their status from your dashboard." },
  { icon: BadgeDollarSign, title: "Transparent Pricing", text: "See clear prices upfront so you can plan your budget with confidence." },
];

export default function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Why Choose WedPlan?</h2>
        <p className="mt-2 text-muted-foreground">Everything you need to plan your big day</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <it.icon className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}