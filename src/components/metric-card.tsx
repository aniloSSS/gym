import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon
}: {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="animate-fade-up">
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
          {unit && <p className="mt-1 text-xs text-muted-foreground">{unit}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/12 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
