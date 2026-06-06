import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Send, Eye, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const sampleDraft = `Dear Rasa Catering Team,

I hope this message finds you well! My name is Priya, and I'm a wedding planner coordinating an upcoming Indian wedding for the Singh-Patel family in November 2026.

We're looking for an experienced caterer who specializes in authentic North Indian and Gujarati cuisine for a multi-event wedding with approximately 350-500 guests across several celebrations.

The events requiring catering include:
• Sangeet (Nov 13) — 350 guests, cocktail + dinner service
• Wedding Ceremony (Nov 14) — 400 guests, lunch service  
• Reception (Nov 15) — 500 guests, full dinner + dessert stations

Could you share your availability, menu options, and pricing for events of this scale? We'd love to schedule a tasting as well.

Looking forward to hearing from you!

Best regards,
Priya`;

const outreachHistory = [
  { vendor: "Rasa Catering Co.", status: "Responded", date: "Mar 15, 2026" },
  { vendor: "Spice Route Catering", status: "Pending", date: "Mar 14, 2026" },
  { vendor: "Taj Events Catering", status: "Shortlisted", date: "Mar 12, 2026" },
];

const statusColors: Record<string, string> = {
  Responded: "bg-flag-green-bg text-flag-green",
  Pending: "bg-flag-yellow-bg text-flag-yellow",
  Shortlisted: "bg-secondary text-secondary-foreground",
};

export default function Outreach() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-heading font-bold">AI Vendor Outreach</h1>
          <p className="text-muted-foreground mt-1">AI-generated vendor emails in your voice (sample preview)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Draft Preview */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Generated Outreach Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  defaultValue={sampleDraft}
                  rows={18}
                  className="font-body text-sm leading-relaxed"
                />
                <div className="flex gap-3 mt-4">
                  <Button variant="hero">
                    <Send className="w-4 h-4 mr-1" /> Send Email
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-1" /> Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Outreach History */}
          <div>
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Outreach History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {outreachHistory.map((item) => (
                  <div key={item.vendor} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.vendor}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.date}
                      </p>
                    </div>
                    <Badge className={`${statusColors[item.status]} border-0 text-xs`}>{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
