export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      budget_items: {
        Row: {
          allocated: number | null
          category: string
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          spent: number | null
          updated_at: string
          vendor_id: string | null
          wedding_id: string
        }
        Insert: {
          allocated?: number | null
          category: string
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          spent?: number | null
          updated_at?: string
          vendor_id?: string | null
          wedding_id: string
        }
        Update: {
          allocated?: number | null
          category?: string
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          spent?: number | null
          updated_at?: string
          vendor_id?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          analysis: Json | null
          created_at: string
          file_name: string
          file_url: string | null
          id: string
          risk_score: string | null
          signed_at: string | null
          status: string | null
          updated_at: string
          uploaded_by: string
          vendor_id: string | null
          wedding_id: string
        }
        Insert: {
          analysis?: Json | null
          created_at?: string
          file_name: string
          file_url?: string | null
          id?: string
          risk_score?: string | null
          signed_at?: string | null
          status?: string | null
          updated_at?: string
          uploaded_by: string
          vendor_id?: string | null
          wedding_id: string
        }
        Update: {
          analysis?: Json | null
          created_at?: string
          file_name?: string
          file_url?: string | null
          id?: string
          risk_score?: string | null
          signed_at?: string | null
          status?: string | null
          updated_at?: string
          uploaded_by?: string
          vendor_id?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          end_time: string | null
          event_date: string | null
          guest_count: number | null
          id: string
          name: string
          notes: string | null
          sort_order: number | null
          start_time: string | null
          status: string | null
          updated_at: string
          venue: string | null
          wedding_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          event_date?: string | null
          guest_count?: number | null
          id?: string
          name: string
          notes?: string | null
          sort_order?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string
          venue?: string | null
          wedding_id: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          event_date?: string | null
          guest_count?: number | null
          id?: string
          name?: string
          notes?: string | null
          sort_order?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string
          venue?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string
          dietary_notes: string | null
          email: string | null
          event_tags: string[] | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          plus_one: boolean | null
          relationship: string | null
          rsvp_status: string | null
          side: string | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          event_tags?: string[] | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          relationship?: string | null
          rsvp_status?: string | null
          side?: string | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          event_tags?: string[] | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          relationship?: string | null
          rsvp_status?: string | null
          side?: string | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      obligations: {
        Row: {
          amount: number | null
          completed: boolean | null
          completed_at: string | null
          contract_id: string
          created_at: string
          description: string
          due_date: string
          id: string
          notes: string | null
          wedding_id: string
        }
        Insert: {
          amount?: number | null
          completed?: boolean | null
          completed_at?: string | null
          contract_id: string
          created_at?: string
          description: string
          due_date: string
          id?: string
          notes?: string | null
          wedding_id: string
        }
        Update: {
          amount?: number | null
          completed?: boolean | null
          completed_at?: string | null
          contract_id?: string
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "obligations_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obligations_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_messages: {
        Row: {
          body: string
          created_at: string
          created_by: string
          id: string
          response_status: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          updated_at: string
          vendor_id: string | null
          wedding_id: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by: string
          id?: string
          response_status?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          vendor_id?: string | null
          wedding_id: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string
          id?: string
          response_status?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          vendor_id?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_messages_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      style_profiles: {
        Row: {
          created_at: string
          id: string
          sample_emails: string[] | null
          tone: string | null
          updated_at: string
          user_id: string
          vocabulary_preferences: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          sample_emails?: string[] | null
          tone?: string | null
          updated_at?: string
          user_id: string
          vocabulary_preferences?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          sample_emails?: string[] | null
          tone?: string | null
          updated_at?: string
          user_id?: string
          vocabulary_preferences?: Json | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          category: string
          created_at: string
          email: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string
          website: string | null
          wedding_id: string
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
          wedding_id: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_members: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["wedding_role"]
          user_id: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["wedding_role"]
          user_id: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["wedding_role"]
          user_id?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_members_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      weddings: {
        Row: {
          created_at: string
          created_by: string
          cultural_background: Json | null
          id: string
          name: string
          partner1_name: string | null
          partner2_name: string | null
          total_budget: number | null
          updated_at: string
          wedding_date: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          cultural_background?: Json | null
          id?: string
          name: string
          partner1_name?: string | null
          partner2_name?: string | null
          total_budget?: number | null
          updated_at?: string
          wedding_date?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          cultural_background?: Json | null
          id?: string
          name?: string
          partner1_name?: string | null
          partner2_name?: string | null
          total_budget?: number | null
          updated_at?: string
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_wedding_member: {
        Args: { _user_id: string; _wedding_id: string }
        Returns: boolean
      }
    }
    Enums: {
      wedding_role: "planner" | "couple" | "parent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      wedding_role: ["planner", "couple", "parent"],
    },
  },
} as const
