import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText, LayoutDashboard, Users, CalendarDays,
  DollarSign, Mail, Sparkles, LogOut, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plannerNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Contract Intelligence", icon: FileText, path: "/contracts" },
  { label: "Vendors", icon: Users, path: "/vendors" },
  { label: "Events", icon: CalendarDays, path: "/events" },
  { label: "Budget", icon: DollarSign, path: "/budget" },
  { label: "Guest List", icon: Users, path: "/guests" },
  { label: "Outreach", icon: Mail, path: "/outreach" },
];

const coupleNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Contract Reviews", icon: FileText, path: "/contracts" },
  { label: "Events", icon: CalendarDays, path: "/events" },
  { label: "Budget", icon: DollarSign, path: "/budget" },
  { label: "Guest List", icon: Users, path: "/guests" },
];

export default function AppSidebar() {
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = role === "planner" ? plannerNav : coupleNav;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-heading font-bold text-foreground">ShaadiAI</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 capitalize">{role} Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User / Sign Out */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <p className="text-xs text-muted-foreground truncate px-1">
          {user?.email}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => { signOut(); navigate("/"); }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
