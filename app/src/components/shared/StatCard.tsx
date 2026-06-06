import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
}

export default function StatCard({ label, value, icon: Icon, iconClassName = "text-primary" }: StatCardProps) {
  return (
    <Card className="shadow-soft border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold font-heading mt-1">{value}</p>
          </div>
          <Icon className={`w-10 h-10 opacity-70 ${iconClassName}`} />
        </div>
      </CardContent>
    </Card>
  );
}
