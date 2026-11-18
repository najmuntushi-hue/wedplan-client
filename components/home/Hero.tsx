"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-rose-950/80 via-rose-900/60 to-transparent" />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-white"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-rose-200">
            Wedding Planning Made Simple
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Plan Your Dream Wedding With Trusted Vendors
          </h1>
          <p className="mt-5 text-lg text-rose-50/90">
            Discover photographers, venues, decorators, caterers and more. Compare services and
            request bookings in minutes.
          </p>
          <Link
            href="/services"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 h-12 bg-rose-600 px-8 text-base hover:bg-rose-700"
            )}
          >
            Explore Wedding Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}