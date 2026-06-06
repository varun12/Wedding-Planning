import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ContractAnalysis, Obligation } from "@/pages/Contracts";

const vendorCategories = [
  "Venue", "Photographer", "Videographer", "Caterer",
  "Décor", "Entertainment", "Florist", "Makeup Artist",
  "Mehndi Artist", "DJ", "Pandit/Officiant", "Other"
];

interface Props {
  onAnalysis: (analysis: ContractAnalysis) => void;
  onObligations: (obligations: Obligation[]) => void;
}

export default function ContractUpload({ onAnalysis, onObligations }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [vendorName, setVendorName] = useState("");
  const [vendorCategory, setVendorCategory] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
    else toast.error("Please upload a PDF file");
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type === "application/pdf") setFile(f);
    else toast.error("Please upload a PDF file");
  };

  const handleAnalyze = async () => {
    if (!file || !vendorName || !vendorCategory) {
      toast.error("Please fill in all fields and upload a contract");
      return;
    }

    setProcessing(true);
    setProgress(10);
    setStage("Extracting text from PDF...");

    try {
      // Read PDF as text (basic extraction)
      const text = await file.text();

      setProgress(30);
      setStage("Analyzing contract with AI...");

      const { data, error } = await supabase.functions.invoke("analyze-contract", {
        body: {
          contractText: text,
          vendorName,
          vendorCategory,
        },
      });

      if (error) throw error;

      setProgress(90);
      setStage("Preparing results...");

      onAnalysis(data.analysis);
      if (data.obligations) {
        onObligations(data.obligations);
      }

      setProgress(100);
      setStage("Complete!");
      toast.success("Contract analysis complete!");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast.error("Analysis failed. Using demo data for preview.");

      // Fallback demo data
      const demoAnalysis: ContractAnalysis = {
        vendorName,
        vendorCategory,
        riskScore: "Medium",
        riskRationale: "The contract contains some non-standard clauses that warrant attention, particularly around cancellation fees and overtime charges.",
        sections: [
          { title: "Payment Schedule & Deposit", content: "A 50% non-refundable deposit of $12,500 is required upon signing. The remaining balance of $12,500 is due 30 days prior to the event date. Late payments incur a 5% monthly surcharge." },
          { title: "Cancellation & Refund Terms", content: "Cancellation more than 6 months prior: 25% of deposit retained. 3–6 months: 50% retained. Less than 3 months: full deposit forfeited. No refunds on the final payment once made." },
          { title: "What's Included", content: "Venue rental for up to 10 hours, basic furniture setup (200 chairs, 20 round tables), on-site coordinator, parking for up to 150 vehicles, and bridal suite access from 10 AM." },
          { title: "What's Excluded", content: "Catering, bar service, audio/visual equipment, additional décor beyond basic setup, valet parking, and security beyond one guard are not included." },
          { title: "Overtime Rates", content: "Each additional hour beyond 10 hours is billed at $2,500 per hour, with a minimum 2-hour overtime block required." },
          { title: "Exclusivity Clauses", content: "The venue requires exclusive use of their preferred caterer list (5 approved caterers). Outside caterers are subject to a $3,000 surcharge and must provide proof of $2M liability insurance." },
          { title: "Liability & Force Majeure", content: "The venue's total liability is capped at the amount paid. Force majeure includes weather, pandemics, and government orders — allows rescheduling within 12 months but no refund." },
        ],
        flags: [
          { clause: "Non-refundable deposit of 50%", rating: "yellow", explanation: "A 50% non-refundable deposit is on the higher end for Indian wedding venues. The industry standard for venues in this price range is typically 25–35%.", benchmark: "Standard range: 25–35% deposit for venues over $20K" },
          { clause: "2-hour minimum overtime block at $2,500/hr", rating: "red", explanation: "This overtime structure is significantly above market rate. Most comparable venues charge $1,000–$1,500/hr without a minimum block requirement. For Indian weddings that frequently run over schedule, this could add $5,000+ unexpectedly.", benchmark: "Market rate: $1,000–$1,500/hr, no minimum block" },
          { clause: "Exclusive caterer requirement with $3,000 surcharge", rating: "red", explanation: "Restricting caterer choice is problematic for Indian weddings where couples often have specific dietary and cuisine requirements. The $3,000 surcharge for outside caterers significantly limits negotiating power.", benchmark: "Many comparable venues allow outside caterers with a standard kitchen fee of $500–$1,000" },
          { clause: "Force majeure — rescheduling only, no refund", rating: "yellow", explanation: "While rescheduling within 12 months is reasonable, the absence of any refund option for force majeure events puts all risk on the client. Some venues offer partial refunds or credit toward future events.", benchmark: "Better terms: partial refund (25–50%) or full credit with extended timeline" },
          { clause: "Liability capped at amount paid", rating: "green", explanation: "This is a standard liability cap for venue contracts and is within industry norms.", benchmark: "Industry standard" },
          { clause: "Basic furniture and coordinator included", rating: "green", explanation: "Including 200 chairs, 20 tables, and an on-site coordinator is a solid package for the price point.", benchmark: "In line with market expectations" },
        ],
      };
      const demoObligations: Obligation[] = [
        { id: "1", description: "Initial deposit payment (50%)", dueDate: "2026-05-15", amount: "$12,500", completed: false },
        { id: "2", description: "Final headcount confirmation", dueDate: "2026-10-01", amount: undefined, completed: false },
        { id: "3", description: "Final balance payment", dueDate: "2026-10-15", amount: "$12,500", completed: false },
        { id: "4", description: "Insurance certificate submission", dueDate: "2026-09-15", amount: undefined, completed: false },
      ];
      onAnalysis(demoAnalysis);
      onObligations(demoObligations);
    } finally {
      setProcessing(false);
      setProgress(0);
      setStage("");
    }
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardContent className="pt-6 space-y-6">
        {/* Vendor Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vendor Name</Label>
            <Input
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g., Grand Hyatt Hotel"
            />
          </div>
          <div className="space-y-2">
            <Label>Vendor Category</Label>
            <Select value={vendorCategory} onValueChange={setVendorCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {vendorCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            file ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="font-medium">Drop your contract PDF here or click to browse</p>
              <p className="text-sm text-muted-foreground">PDF files up to 25MB</p>
            </div>
          )}
        </div>

        {/* Processing Progress */}
        {processing && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {stage}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Analyze Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleAnalyze}
          disabled={!file || !vendorName || !vendorCategory || processing}
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><FileText className="w-4 h-4" /> Analyze Contract</>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" />
          AI-generated summaries are for reference only. Always verify with a legal professional.
        </p>
      </CardContent>
    </Card>
  );
}
