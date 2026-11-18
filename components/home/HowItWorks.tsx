"use client";

import { motion } from "motion/react";

const steps = [
  { n: "1", title: "Browse Services", text: "Explore wedding services from verified vendors." },
  { n: "2", title: "Send a Request", text: "Pick your event date and location, then submit a booking request." },
  { n: "3", title: "Vendor Responds", text: "The vendor accepts or rejects your request." },
  { n: "4", title: "Enjoy Your Day", text: "Track everything from your dashboard and celebrate stress-free." },
];

export default function HowItWorks() {
  return (
    <section className="bg-rose-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">How WedPlan Works</h2>
          <p className="mt-2 text-muted-foreground">Four simple steps to your perfect wedding</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 font-bold text-white">
                {s.n}
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}