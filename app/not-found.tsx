import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rose-50 px-4 text-center">
      <Heart className="h-12 w-12 fill-rose-600 text-rose-600" />
      <h1 className="mt-4 text-6xl font-bold text-rose-600">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-6 bg-rose-600 hover:bg-rose-700")}>
        Back to Home
      </Link>
    </div>
  );
}