import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { StyleProfile } from "@/types/domain";

export function useStyleProfile() {
  const { user } = useAuth();

  const query = useQuery<StyleProfile | null>({
    queryKey: ["style_profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const qc = useQueryClient();

  const upsertStyleProfile = useMutation({
    mutationFn: async (updates: Partial<Pick<StyleProfile, "tone" | "sample_emails" | "vocabulary_preferences">>) => {
      const { data, error } = await supabase
        .from("style_profiles")
        .upsert({ user_id: user!.id, ...updates }, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["style_profile", user?.id] }),
  });

  return { styleProfile: query.data, isLoading: query.isLoading, upsertStyleProfile };
}
