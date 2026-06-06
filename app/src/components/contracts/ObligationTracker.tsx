import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, AlertCircle } from "lucide-react";
import type { Obligation } from "@/pages/Contracts";

interface Props {
  obligations: Obligation[];
  setObligations: (obligations: Obligation[]) => void;
}

export default function ObligationTracker({ obligations, setObligations }: Props) {
  const toggleComplete = (id: string) => {
    setObligations(
      obligations.map((o) => (o.id === id ? { ...o, completed: !o.completed } : o))
    );
  };

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getUrgencyColor = (days: number) => {
    if (days < 0) return "text-flag-red";
    if (days <= 7) return "text-flag-red";
    if (days <= 14) return "text-flag-yellow";
    return "text-flag-green";
  };

  if (obligations.length === 0) {
    return (
      <Card className="shadow-soft border-border/50">
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading text-lg font-semibold mb-1">No Obligations Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Obligations are automatically extracted when you mark a contract as signed.
            Upload and analyze a contract first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="font-heading text-xl">Contract Obligations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {obligations.map((ob) => {
            const days = getDaysUntil(ob.dueDate);
            const urgency = getUrgencyColor(days);
            return (
              <div
                key={ob.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  ob.completed ? "bg-muted/50 opacity-60" : "bg-background"
                }`}
              >
                <Checkbox
                  checked={ob.completed}
                  onCheckedChange={() => toggleComplete(ob.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${ob.completed ? "line-through" : ""}`}>
                    {ob.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(ob.dueDate).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </span>
                    {ob.amount && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {ob.amount}
                      </span>
                    )}
                  </div>
                </div>
                {!ob.completed && (
                  <Badge variant="outline" className={`${urgency} border-current text-xs`}>
                    {days < 0 ? "Overdue" : days === 0 ? "Today" : `${days}d`}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
