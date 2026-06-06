/**
 * React Query hooks for all wedding-scoped data.
 * Each hook returns { data, isLoading, error } + create/update/remove mutations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  Event, EventInsert, EventUpdate,
  Vendor, VendorInsert, VendorUpdate,
  Contract, ContractInsert, ContractUpdate,
  Obligation, ObligationInsert, ObligationUpdate,
  BudgetItem, BudgetItemInsert, BudgetItemUpdate,
  Guest, GuestInsert, GuestUpdate,
  OutreachMessage, OutreachMessageInsert, OutreachMessageUpdate,
} from "@/types/domain";

// ─── Events ─────────────────────────────────────────────────────

export function useEvents(weddingId: string | undefined | null) {
  const qc = useQueryClient();
  const key = ["events", weddingId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("wedding_id", weddingId!)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!weddingId,
  });

  const create = useMutation({
    mutationFn: async (item: EventInsert) => {
      const { data, error } = await supabase.from("events").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: EventUpdate & { id: string }) => {
      const { data, error } = await supabase.from("events").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update, remove };
}

// ─── Vendors ────────────────────────────────────────────────────

export function useVendors(weddingId: string | undefined | null) {
  const qc = useQueryClient();
  const key = ["vendors", weddingId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("wedding_id", weddingId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!weddingId,
  });

  const create = useMutation({
    mutationFn: async (item: VendorInsert) => {
      const { data, error } = await supabase.from("vendors").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: VendorUpdate & { id: string }) => {
      const { data, error } = await supabase.from("vendors").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update, remove };
}

// ─── Contracts ──────────────────────────────────────────────────

export function useContracts(weddingId: string | undefined | null) {
  const qc = useQueryClient();
  const key = ["contracts", weddingId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("wedding_id", weddingId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!weddingId,
  });

  const create = useMutation({
    mutationFn: async (item: ContractInsert) => {
      const { data, error } = await supabase.from("contracts").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: ContractUpdate & { id: string }) => {
      const { data, error } = await supabase.from("contracts").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update };
}

// ─── Obligations ────────────────────────────────────────────────

export function useObligations(weddingId: string | undefined | null) {
  const qc = useQueryClient();
  const key = ["obligations", weddingId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obligations")
        .select("*")
        .eq("wedding_id", weddingId!)
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!weddingId,
  });

  const create = useMutation({
    mutationFn: async (item: ObligationInsert) => {
      const { data, error } = await supabase.from("obligations").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: ObligationUpdate & { id: string }) => {
      const { data, error } = await supabase.from("obligations").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update };
}

// ─── Budget Items ───────────────────────────────────────────────

export function useBudgetItems(weddingId: string | undefined | null) {
  const qc = useQueryClient();
  const key = ["budget_items", weddingId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_items")
        .select("*")
        .eq("wedding_id", weddingId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!weddingId,
  });

  const create = useMutation({
    mutationFn: async (item: BudgetItemInsert) => {
      const { data, error } = await supabase.from("budget_items").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: BudgetItemUpdate & { id: string }) => {
      const { data, error } = await supabase.from("budget_items").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budget_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update, remove };
}

// ─── Guests ─────────────────────────────────────────────────────

export function useGuests(weddingId: string | undefined | null) {
  const qc = useQueryClient();
  const key = ["guests", weddingId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("wedding_id", weddingId!)
        .order("name", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!weddingId,
  });

  const create = useMutation({
    mutationFn: async (item: GuestInsert) => {
      const { data, error } = await supabase.from("guests").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: GuestUpdate & { id: string }) => {
      const { data, error } = await supabase.from("guests").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update, remove };
}

// ─── Outreach Messages ──────────────────────────────────────────

export function useOutreachMessages(weddingId: string | undefined | null) {
  const qc = useQueryClient();
  const key = ["outreach_messages", weddingId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outreach_messages")
        .select("*")
        .eq("wedding_id", weddingId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!weddingId,
  });

  const create = useMutation({
    mutationFn: async (item: OutreachMessageInsert) => {
      const { data, error } = await supabase.from("outreach_messages").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: OutreachMessageUpdate & { id: string }) => {
      const { data, error } = await supabase.from("outreach_messages").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update };
}
