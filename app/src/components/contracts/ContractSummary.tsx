import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Shield, ShieldAlert, ShieldCheck, ChevronDown, ChevronUp,
  Send, Copy, Check, AlertTriangle, CheckCircle, Info
} from "lucide-react";
import type { ContractAnalysis, ContractFlag } from "@/pages/Contracts";
import ResponseDraftModal from "./ResponseDraftModal";

const riskConfig = {
  Low: { icon: ShieldCheck, color: "text-flag-green", bg: "bg-flag-green-bg", label: "Low Risk" },
  Medium: { icon: Shield, color: "text-flag-yellow", bg: "bg-flag-yellow-bg", label: "Medium Risk" },
  High: { icon: ShieldAlert, color: "text-flag-red", bg: "bg-flag-red-bg", label: "High Risk" },
};

const flagConfig = {
  green: { icon: CheckCircle, color: "text-flag-green", bg: "bg-flag-green-bg", label: "Standard" },
  yellow: { icon: Info, color: "text-flag-yellow", bg: "bg-flag-yellow-bg", label: "Review" },
  red: { icon: AlertTriangle, color: "text-flag-red", bg: "bg-flag-red-bg", label: "High Risk" },
};

export default function ContractSummary({ analysis }: { analysis: ContractAnalysis }) {
  const [expandedFlags, setExpandedFlags] = useState<Set<number>>(new Set());
  const [draftFlag, setDraftFlag] = useState<ContractFlag | null>(null);
  const risk = riskConfig[analysis.riskScore];
  const RiskIcon = risk.icon;

  const toggleFlag = (idx: number) => {
    setExpandedFlags((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Risk Score Banner */}
        <Card className={`${risk.bg} border-none shadow-card`}>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${risk.bg}`}>
                <RiskIcon className={`w-8 h-8 ${risk.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-heading font-bold">Contract Risk Score: {risk.label}</h3>
                  <Badge variant="outline" className={`${risk.color} border-current`}>
                    {analysis.riskScore}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{analysis.riskRationale}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{analysis.vendorName}</span>
          <Badge variant="secondary">{analysis.vendorCategory}</Badge>
          <span>{analysis.flags.filter(f => f.rating === "red").length} high-risk flags</span>
          <span>{analysis.flags.filter(f => f.rating === "yellow").length} review items</span>
        </div>

        {/* Contract Summary Sections */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Plain-Language Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {analysis.sections.map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm text-foreground mb-1">{section.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                {i < analysis.sections.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Traffic Light Flags */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Clause Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.flags.map((flag, i) => {
              const config = flagConfig[flag.rating];
              const FlagIcon = config.icon;
              const isExpanded = expandedFlags.has(i);

              return (
                <div
                  key={i}
                  className={`rounded-lg border p-4 transition-all ${config.bg} border-transparent`}
                >
                  <button
                    onClick={() => toggleFlag(i)}
                    className="w-full flex items-start gap-3 text-left"
                  >
                    <FlagIcon className={`w-5 h-5 mt-0.5 ${config.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{flag.clause}</span>
                        <Badge variant="outline" className={`${config.color} border-current text-xs`}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 ml-8 space-y-3 animate-fade-in">
                      <p className="text-sm text-muted-foreground">{flag.explanation}</p>
                      {flag.benchmark && (
                        <div className="bg-background/80 rounded-md px-3 py-2 text-xs text-muted-foreground">
                          <span className="font-medium">Market Benchmark:</span> {flag.benchmark}
                        </div>
                      )}
                      {(flag.rating === "yellow" || flag.rating === "red") && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={(e) => { e.stopPropagation(); setDraftFlag(flag); }}
                        >
                          <Send className="w-3 h-3 mr-1" /> Draft Response
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {draftFlag && (
        <ResponseDraftModal
          flag={draftFlag}
          vendorName={analysis.vendorName}
          vendorCategory={analysis.vendorCategory}
          onClose={() => setDraftFlag(null)}
        />
      )}
    </>
  );
}
