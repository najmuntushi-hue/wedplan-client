"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rose-50 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-rose-600" />
      <h1 className="mt-4 text-3xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} className="bg-rose-600 hover:bg-rose-700">
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}