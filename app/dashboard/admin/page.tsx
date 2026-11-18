import RoleGuard from "@/components/dashboard/RoleGuard";

export default function AdminOverview() {
  return (
    <RoleGuard allow="admin">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      <p className="mt-2 text-muted-foreground">Stats coming soon.</p>
    </RoleGuard>
  );
}