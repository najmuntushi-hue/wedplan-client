"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoleGuard({
  allow,
  children,
}: {
  allow: "vendor" | "customer" | "admin";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as any;
  const role = user?.role === "admin" || user?.role === "vendor" ? user.role : "customer";

  useEffect(() => {
    if (isPending) return;
    if (!user) router.replace("/sign-in");
    else if (user.isBlocked) router.replace("/sign-in");
    else if (role !== allow) router.replace(`/dashboard/${role}`);
  }, [isPending, user, role, allow, router]);

  if (isPending || !user || role !== allow) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }
  return <>{children}</>;
}