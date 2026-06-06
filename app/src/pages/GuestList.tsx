import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const sampleGuests = [
  { name: "Priya & Raj Sharma", side: "Bride", events: ["Mehndi", "Sangeet", "Ceremony", "Reception"], rsvp: "confirmed" },
  { name: "Vikram Mehta", side: "Groom", events: ["Sangeet", "Ceremony", "Reception"], rsvp: "confirmed" },
  { name: "Anita Patel", side: "Bride", events: ["Mehndi", "Haldi", "Sangeet", "Ceremony", "Reception"], rsvp: "pending" },
  { name: "Deepak & Sunita Gupta", side: "Groom", events: ["Ceremony", "Reception"], rsvp: "confirmed" },
  { name: "Kavita Reddy", side: "Bride", events: ["Mehndi", "Sangeet", "Ceremony"], rsvp: "declined" },
  { name: "Arjun Singh Family", side: "Groom", events: ["Haldi", "Baraat", "Ceremony", "Reception"], rsvp: "pending" },
  { name: "Neha & Sanjay Kapoor", side: "Mutual", events: ["Sangeet", "Ceremony", "Reception"], rsvp: "confirmed" },
  { name: "Meera Joshi", side: "Bride", events: ["Mehndi", "Haldi", "Sangeet", "Ceremony", "Reception"], rsvp: "confirmed" },
  { name: "Rohit Agarwal Family", side: "Groom", events: ["Baraat", "Ceremony", "Reception"], rsvp: "pending" },
  { name: "Pooja & Amit Desai", side: "Mutual", events: ["Ceremony", "Reception"], rsvp: "confirmed" },
  { name: "Dr. Ritu Malhotra", side: "Bride", events: ["Sangeet", "Ceremony", "Reception"], rsvp: "confirmed" },
  { name: "Karan Bhatia Family", side: "Groom", events: ["Mehndi", "Haldi", "Sangeet", "Baraat", "Ceremony", "Reception"], rsvp: "confirmed" },
];

const rsvpColors: Record<string, string> = {
  confirmed: "bg-flag-green-bg text-flag-green",
  pending: "bg-flag-yellow-bg text-flag-yellow",
  declined: "bg-flag-red-bg text-flag-red",
};

export default function GuestList() {
  const [search, setSearch] = useState("");
  const filtered = sampleGuests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Guest List</h1>
            <p className="text-muted-foreground mt-1">{sampleGuests.length} guests across all events (sample data)</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {filtered.map((guest, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{guest.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {guest.events.map((ev) => (
                        <Badge key={ev} variant="secondary" className="text-xs">{ev}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${rsvpColors[guest.rsvp]}`}>
                    {guest.side}
                  </Badge>
                  <Badge className={`text-xs ${rsvpColors[guest.rsvp]} border-0`}>
                    {guest.rsvp}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
