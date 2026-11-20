"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authFetch } from "@/lib/api";

export default function PaymentSuccessPage() {
  const [premium, setPremium] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let tries = 0;
    const timer = setInterval(async () => {
      tries++;
      try {
        const s = await authFetch("/vendor/stats");
        if (s.plan === "premium") {
          setPremium(true);
          setChecking(false);
          clearInterval(timer);
        }
      } catch {}
      if (tries >= 10) {
        setChecking(false);
        clearInterval(timer);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-4 text-3xl font-bold">Payment Successful</h1>
      <p className="mt-2 text-muted-foreground">
        {premium
          ? "Your Premium plan is now active."
          : checking
          ? "Confirming your payment..."
          : "Payment received. Premium will activate shortly once Stripe confirms it."}
      </p>
      <Link href="/dashboard/vendor/subscription" className={cn(buttonVariants(), "mt-6 bg-rose-600 hover:bg-rose-700")}>
        Go to Subscription
      </Link>
    </div>
  );
}