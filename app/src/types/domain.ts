// Domain types for ShaadiAI - derived from database schema
// Use these throughout the app instead of inline types

import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Base table row types
export type Profile = Tables<"profiles">;
export type Wedding = Tables<"weddings">;
export type WeddingMember = Tables<"wedding_members">;
export type Event = Tables<"events">;
export type Vendor = Tables<"vendors">;
export type Contract = Tables<"contracts">;
export type Obligation = Tables<"obligations">;
export type BudgetItem = Tables<"budget_items">;
export type Guest = Tables<"guests">;
export type OutreachMessage = Tables<"outreach_messages">;
export type StyleProfile = Tables<"style_profiles">;

// Insert types
export type WeddingInsert = TablesInsert<"weddings">;
export type EventInsert = TablesInsert<"events">;
export type VendorInsert = TablesInsert<"vendors">;
export type ContractInsert = TablesInsert<"contracts">;
export type ObligationInsert = TablesInsert<"obligations">;
export type BudgetItemInsert = TablesInsert<"budget_items">;
export type GuestInsert = TablesInsert<"guests">;
export type OutreachMessageInsert = TablesInsert<"outreach_messages">;

// Update types
export type WeddingUpdate = TablesUpdate<"weddings">;
export type EventUpdate = TablesUpdate<"events">;
export type VendorUpdate = TablesUpdate<"vendors">;
export type ContractUpdate = TablesUpdate<"contracts">;
export type ObligationUpdate = TablesUpdate<"obligations">;
export type BudgetItemUpdate = TablesUpdate<"budget_items">;
export type GuestUpdate = TablesUpdate<"guests">;
export type OutreachMessageUpdate = TablesUpdate<"outreach_messages">;

// Enum types
export type WeddingRole = "planner" | "couple" | "parent";

// Contract analysis types (stored as JSONB)
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

// Cultural background (stored as JSONB)
export interface CulturalBackground {
  region?: string;
  religion?: string;
  customs?: string[];
  blendMode?: boolean;
  partner1Background?: string;
  partner2Background?: string;
}

// Vendor categories specific to Indian weddings
export const VENDOR_CATEGORIES = [
  "Venue",
  "Caterer",
  "Photographer",
  "Videographer",
  "Décor",
  "Entertainment",
  "Mehndi Artist",
  "Makeup Artist",
  "Florist",
  "DJ",
  "Pandit/Officiant",
  "Invitation Designer",
  "Transportation",
  "Other",
] as const;

// Standard Indian wedding events
export const STANDARD_EVENTS = [
  "Mehndi",
  "Haldi",
  "Sangeet",
  "Baraat",
  "Wedding Ceremony",
  "Reception",
] as const;

// Vendor status flow
export const VENDOR_STATUSES = [
  "shortlisted",
  "contacted",
  "negotiating",
  "contracted",
  "paid",
] as const;

// Guest RSVP statuses
export const RSVP_STATUSES = [
  "pending",
  "confirmed",
  "declined",
  "tentative",
] as const;

// Guest sides
export const GUEST_SIDES = ["bride", "groom", "mutual"] as const;
