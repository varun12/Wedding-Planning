import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import ContractUpload from "@/components/contracts/ContractUpload";
import ContractSummary from "@/components/contracts/ContractSummary";
import ObligationTracker from "@/components/contracts/ObligationTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckSquare } from "lucide-react";

export interface ContractFlag {
  clause: string;
  rating: "green" | "yellow" | "red";
  explanation: string;
  benchmark?: string;
}

export interface ContractSection {
  title: string;
  content: string;
}

export interface ContractAnalysis {
  vendorName: string;
  vendorCategory: string;
  riskScore: "Low" | "Medium" | "High";
  riskRationale: string;
  sections: ContractSection[];
  flags: ContractFlag[];
}

export interface Obligation {
  id: string;
  description: string;
  dueDate: string;
  amount?: string;
  completed: boolean;
}

export default function Contracts() {
  const { role } = useAuth();
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [activeTab, setActiveTab] = useState("review");

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-heading font-bold">AI Contract Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Upload vendor contracts for AI-powered analysis and risk assessment
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="review" className="gap-2">
              <FileText className="w-4 h-4" /> Contract Review
            </TabsTrigger>
            <TabsTrigger value="obligations" className="gap-2">
              <CheckSquare className="w-4 h-4" /> Obligation Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="space-y-6 mt-6">
            <ContractUpload onAnalysis={setAnalysis} onObligations={setObligations} />
            {analysis && <ContractSummary analysis={analysis} />}
          </TabsContent>

          <TabsContent value="obligations" className="mt-6">
            <ObligationTracker obligations={obligations} setObligations={setObligations} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
