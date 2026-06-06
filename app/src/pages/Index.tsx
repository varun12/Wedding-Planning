import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, Shield, Send, CheckSquare, ArrowRight, Star } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import { useEffect } from "react";

const features = [
  {
    icon: FileText,
    title: "Plain-Language Summaries",
    description: "Upload vendor contracts and get instant, easy-to-understand summaries of all key terms.",
  },
  {
    icon: Shield,
    title: "Traffic Light Flagging",
    description: "Each clause rated Green, Yellow, or Red against Indian wedding market benchmarks.",
  },
  {
    icon: Send,
    title: "One-Click Response Drafting",
    description: "Generate professional negotiation emails for any flagged clause in under 10 seconds.",
  },
  {
    icon: CheckSquare,
    title: "Obligation Tracking",
    description: "Automatically extract payment deadlines and obligations from signed contracts.",
  },
];

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-heading font-bold">ShaadiAI</span>
          </div>
          <Button variant="hero" onClick={() => navigate("/auth")}>
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={heroPattern} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
            <Star className="w-3 h-3 mr-1 text-gold" /> AI-Powered Wedding Planning
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight max-w-4xl mx-auto">
            Wedding planning built for{" "}
            <span className="text-primary">Indian weddings</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            The first AI platform that understands multi-event, multi-vendor, multi-family wedding coordination.
            Starting with the industry's first AI Contract Intelligence Suite.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
              Start Planning <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline-primary" size="lg" onClick={() => navigate("/auth")}>
              I'm a Planner
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold">AI Contract Intelligence Suite</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            The first AI-powered contract review tool built specifically for South Asian wedding vendors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border border-border bg-card shadow-soft hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="gradient-hero py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "$225K–$285K", label: "Avg. Indian Wedding (US)" },
            { stat: "4–6", label: "Events Per Wedding" },
            { stat: "20–30+", label: "Vendors to Coordinate" },
            { stat: "300–400+", label: "Avg. Guest Count" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-heading font-bold text-primary-foreground">{s.stat}</p>
              <p className="text-sm text-primary-foreground/80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-heading font-semibold">ShaadiAI</span>
        </div>
        <p>AI-Powered Wedding Planning for the Indian Diaspora</p>
      </footer>
    </div>
  );
}
