import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, FileText, ExternalLink } from "lucide-react";

const vendors = [
  { name: "Grand Hyatt Hotel", category: "Venue", status: "Contracted", contact: "events@grandhyatt.com", phone: "(555) 123-4567", location: "Downtown, NYC" },
  { name: "Rasa Catering Co.", category: "Caterer", status: "Shortlisted", contact: "info@rasacatering.com", phone: "(555) 234-5678", location: "Queens, NYC" },
  { name: "Amar Photography", category: "Photographer", status: "Contracted", contact: "hello@amarphotography.com", phone: "(555) 345-6789", location: "Brooklyn, NYC" },
  { name: "Lotus Décor Studio", category: "Décor", status: "Negotiating", contact: "design@lotusdecor.com", phone: "(555) 456-7890", location: "Jersey City, NJ" },
  { name: "DJ Desi Beats", category: "Entertainment", status: "Shortlisted", contact: "bookings@desibeats.com", phone: "(555) 567-8901", location: "Edison, NJ" },
  { name: "Mehndi by Priya", category: "Mehndi Artist", status: "Contracted", contact: "priya@mehndibyjpriya.com", phone: "(555) 678-9012", location: "Flushing, NYC" },
];

const statusColors: Record<string, string> = {
  Contracted: "bg-flag-green-bg text-flag-green",
  Negotiating: "bg-flag-yellow-bg text-flag-yellow",
  Shortlisted: "bg-secondary text-secondary-foreground",
};

export default function Vendors() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-heading font-bold">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage your wedding vendors</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => (
            <Card key={vendor.name} className="shadow-soft border-border/50 hover:shadow-card transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg">{vendor.name}</CardTitle>
                  <Badge className={`${statusColors[vendor.status]} border-0 text-xs`}>{vendor.status}</Badge>
                </div>
                <Badge variant="outline" className="w-fit text-xs">{vendor.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{vendor.contact}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{vendor.phone}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{vendor.location}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
