"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    const user = session?.user as any;
    if (!user) return router.replace("/sign-in");
    const role = user.role === "admin" || user.role === "vendor" ? user.role : "customer";
    router.replace(`/dashboard/${role}`);
  }, [isPending, session, router]);

  return <p className="p-8">Redirecting...</p>;
}