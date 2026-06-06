import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const budgetData = [
  { event: "Venue", allocated: 50000, spent: 25000 },
  { event: "Catering", allocated: 40000, spent: 12000 },
  { event: "Photography", allocated: 15000, spent: 15000 },
  { event: "Décor", allocated: 30000, spent: 18000 },
  { event: "Entertainment", allocated: 12000, spent: 5000 },
  { event: "Mehndi & Haldi", allocated: 8000, spent: 4000 },
  { event: "Attire & Jewelry", allocated: 25000, spent: 20000 },
  { event: "Miscellaneous", allocated: 20000, spent: 8000 },
];

const totalAllocated = budgetData.reduce((s, b) => s + b.allocated, 0);
const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);

export default function Budget() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-heading font-bold">Budget Tracker</h1>
          <p className="text-muted-foreground mt-1">Multi-event budget overview (sample data)</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-soft border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-3xl font-bold font-heading">${totalAllocated.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold font-heading text-primary">${totalSpent.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-3xl font-bold font-heading text-flag-green">${(totalAllocated - totalSpent).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetData.map((item) => {
              const pct = Math.round((item.spent / item.allocated) * 100);
              const isOver = pct > 90;
              return (
                <div key={item.event} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.event}</span>
                    <span className={`text-muted-foreground ${isOver ? "text-flag-red font-medium" : ""}`}>
                      ${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <Progress value={pct} className={`h-2 ${isOver ? "[&>div]:bg-flag-red" : ""}`} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
