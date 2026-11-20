"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authFetch } from "@/lib/api";

export default function SubscriptionPage() {
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authFetch("/vendor/stats").then((s) => setPlan(s.plan)).catch(() => {});
  }, []);

  async function upgrade() {
    setLoading(true);
    try {
      const { url } = await authFetch("/payments/create-checkout-session", { method: "POST" });
      window.location.href = url;
    } catch (e: any) {
      toast.error(e.message || "Could not start checkout");
      setLoading(false);
    }
  }

  const free = ["Maximum 3 Active Services", "Basic Vendor Dashboard", "Booking Request Management"];
  const premium = ["Unlimited Active Services", "Premium Vendor Badge", "All Free Plan Features"];

  return (
    <RoleGuard allow="vendor">
      <h1 className="text-2xl font-bold">Subscription</h1>
      <div className="mt-6 grid max-w-3xl gap-6 md:grid-cols-2">
        <Card className={plan === "free" ? "border-rose-400" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free Plan {plan === "free" && <Badge>Current</Badge>}
            </CardTitle>
            <p className="text-2xl font-bold">$0</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {free.map((f) => (
              <p key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-600" /> {f}</p>
            ))}
          </CardContent>
        </Card>

        <Card className={plan === "premium" ? "border-rose-400" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Premium Plan {plan === "premium" && <Badge className="bg-amber-500">Current</Badge>}
            </CardTitle>
            <p className="text-2xl font-bold">$10<span className="text-sm font-normal">/month</span></p>
          </CardHeader>
          <CardContent className="space-y-2">
            {premium.map((f) => (
              <p key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-600" /> {f}</p>
            ))}
            {plan !== "premium" && (
              <Button className="mt-4 w-full bg-rose-600 hover:bg-rose-700" onClick={upgrade} disabled={loading}>
                {loading ? "Redirecting..." : "Upgrade to Premium"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}