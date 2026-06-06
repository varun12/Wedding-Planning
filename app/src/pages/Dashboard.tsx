import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CalendarDays, DollarSign, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const stats = [
  { label: "Contracts Reviewed", value: "12", icon: FileText, color: "text-primary" },
  { label: "Active Vendors", value: "24", icon: Users, color: "text-accent" },
  { label: "Upcoming Events", value: "6", icon: CalendarDays, color: "text-sage" },
  { label: "Budget Utilized", value: "68%", icon: DollarSign, color: "text-gold" },
];

const recentActivity = [
  { text: "Contract reviewed for Grand Hyatt Venue", time: "2 hours ago", icon: CheckCircle, iconColor: "text-flag-green" },
  { text: "3 clauses flagged in Caterer agreement", time: "5 hours ago", icon: AlertTriangle, iconColor: "text-flag-yellow" },
  { text: "Payment deadline in 14 days — Decor vendor", time: "1 day ago", icon: Clock, iconColor: "text-flag-red" },
  { text: "Photographer contract uploaded", time: "2 days ago", icon: FileText, iconColor: "text-primary" },
];

export default function Dashboard() {
  const { role, user } = useAuth();
  const displayName = user?.user_metadata?.full_name || "there";

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Welcome back, {displayName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === "planner"
              ? "Here's an overview of your active weddings"
              : "Here's your wedding planning status"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-soft border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold font-heading mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-10 h-10 ${stat.color} opacity-70`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <item.icon className={`w-5 h-5 mt-0.5 ${item.iconColor}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
