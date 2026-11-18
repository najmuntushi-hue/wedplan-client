import RoleGuard from "@/components/dashboard/RoleGuard";

export default function CustomerOverview() {
  return (
    <RoleGuard allow="customer">
      <h1 className="text-2xl font-bold">Customer Overview</h1>
      <p className="mt-2 text-muted-foreground">Stats coming soon.</p>
    </RoleGuard>
  );
}