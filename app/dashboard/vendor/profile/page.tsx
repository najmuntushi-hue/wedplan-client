import RoleGuard from "@/components/dashboard/RoleGuard";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function VendorProfilePage() {
  return (
    <RoleGuard allow="vendor">
      <h1 className="mb-6 text-2xl font-bold">Profile Settings</h1>
      <ProfileForm />
    </RoleGuard>
  );
}