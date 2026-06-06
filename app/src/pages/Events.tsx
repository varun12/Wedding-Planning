import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";

const events = [
  { name: "Mehndi", date: "Nov 12, 2026", venue: "The Garden Terrace", guests: 150, time: "4:00 PM – 10:00 PM", status: "confirmed" },
  { name: "Haldi", date: "Nov 13, 2026", venue: "Residence — Bride's Home", guests: 80, time: "10:00 AM – 2:00 PM", status: "confirmed" },
  { name: "Sangeet", date: "Nov 13, 2026", venue: "Grand Ballroom, Hyatt", guests: 350, time: "7:00 PM – 1:00 AM", status: "pending" },
  { name: "Baraat", date: "Nov 14, 2026", venue: "Hotel Entrance & Grounds", guests: 400, time: "3:00 PM – 5:00 PM", status: "confirmed" },
  { name: "Wedding Ceremony", date: "Nov 14, 2026", venue: "Grand Ballroom, Hyatt", guests: 400, time: "5:00 PM – 8:00 PM", status: "confirmed" },
  { name: "Reception", date: "Nov 15, 2026", venue: "Rooftop Pavilion, Hyatt", guests: 500, time: "7:00 PM – 12:00 AM", status: "pending" },
];

export default function Events() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-heading font-bold">Wedding Events</h1>
          <p className="text-muted-foreground mt-1">Your multi-event wedding structure</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.name} className="shadow-soft border-border/50 hover:shadow-card transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg">{event.name}</CardTitle>
                  <Badge variant={event.status === "confirmed" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />{event.date}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{event.time}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.venue}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" />{event.guests} guests</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
