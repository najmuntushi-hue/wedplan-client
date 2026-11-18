import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold text-rose-600">{value}</p>
      </CardContent>
    </Card>
  );
}