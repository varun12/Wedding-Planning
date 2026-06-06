import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ContractFlag } from "@/pages/Contracts";

interface Props {
  flag: ContractFlag;
  vendorName: string;
  vendorCategory: string;
  onClose: () => void;
}

export default function ResponseDraftModal({ flag, vendorName, vendorCategory, onClose }: Props) {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateDraft();
  }, []);

  const generateDraft = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("draft-response", {
        body: { flag, vendorName, vendorCategory },
      });
      if (error) throw error;
      setDraft(data.draft);
    } catch {
      // Fallback draft
      setDraft(
        `Dear ${vendorName} Team,\n\nThank you for sending over the contract. We're excited about the possibility of working together for our upcoming wedding.\n\nAfter reviewing the agreement, we'd like to discuss the following clause:\n\n"${flag.clause}"\n\n${flag.explanation}\n\nWe understand this may be your standard term, but given industry benchmarks (${flag.benchmark || "market norms"}), we'd appreciate the opportunity to discuss a modification. Specifically, we'd suggest:\n\n1. Adjusting this term to align more closely with market standards\n2. Including clear conditions under which exceptions may apply\n\nWe're flexible and open to finding a solution that works for both parties. Would you be available for a brief call this week to discuss?\n\nBest regards`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">
            Draft Response — {flag.clause}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              Drafting response...
            </div>
          ) : (
            <>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={14}
                className="font-body text-sm leading-relaxed"
              />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="hero" onClick={onClose}>
                  <Send className="w-4 h-4 mr-1" /> Done
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
