import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Wedding } from "@/types/domain";

interface WeddingContextType {
  activeWedding: Wedding | null;
  weddings: Wedding[];
  loading: boolean;
  setActiveWeddingId: (id: string) => void;
  refetchWeddings: () => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [activeWeddingId, setActiveWeddingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeddings = async () => {
    if (!user) {
      setWeddings([]);
      setActiveWeddingId(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("weddings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setWeddings(data);
      // Auto-select first wedding if none selected
      if (!activeWeddingId && data.length > 0) {
        setActiveWeddingId(data[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeddings();
  }, [user]);

  const activeWedding = weddings.find((w) => w.id === activeWeddingId) ?? null;

  return (
    <WeddingContext.Provider
      value={{
        activeWedding,
        weddings,
        loading,
        setActiveWeddingId,
        refetchWeddings: fetchWeddings,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) throw new Error("useWedding must be used within a WeddingProvider");
  return context;
}
