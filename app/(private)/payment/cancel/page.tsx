import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <XCircle className="mx-auto h-16 w-16 text-red-600" />
      <h1 className="mt-4 text-3xl font-bold">Payment Cancelled</h1>
      <p className="mt-2 text-muted-foreground">No charge was made. You can try again anytime.</p>
      <Link href="/dashboard/vendor/subscription" className={cn(buttonVariants(), "mt-6 bg-rose-600 hover:bg-rose-700")}>
        Back to Subscription
      </Link>
    </div>
  );
}