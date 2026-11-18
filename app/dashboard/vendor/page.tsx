import RoleGuard from "@/components/dashboard/RoleGuard";

export default function VendorOverview() {
  return (
    <RoleGuard allow="vendor">
      <h1 className="text-2xl font-bold">Vendor Overview</h1>
      <p className="mt-2 text-muted-foreground">Stats coming soon.</p>
    </RoleGuard>
  );
}