import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useBirthdayMode() {
  const [birthdayMode, setBirthdayMode] = useState(false);
  const { user } = useAuth();

  const setBirthdayModeForCurrentUser = async (enabled: boolean) => {
    if (!user) return;

    // Update local state and theme immediately for snappy UI
    setBirthdayMode(enabled);
    if (enabled) {
      document.documentElement.classList.add("birthday-mode");
    } else {
      document.documentElement.classList.remove("birthday-mode");
    }

    // Persist preference without relying on ON CONFLICT
    const { data, error: fetchError } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to fetch birthday preference for current user", fetchError);
    }

    let error = null as any;

    if (data?.id) {
      const { error: updateError } = await supabase
        .from("user_preferences")
        .update({ birthday_mode: enabled })
        .eq("id", data.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert({ user_id: user.id, birthday_mode: enabled });
      error = insertError;
    }

    if (error) {
      console.error("Failed to update birthday mode for current user", error);
    }
  };
 
  useEffect(() => {
    if (!user) return;

    const fetchBirthdayMode = async () => {
      const { data } = await supabase
        .from("user_preferences")
        .select("birthday_mode")
        .eq("user_id", user.id)
        .maybeSingle();

      const isEnabled = data?.birthday_mode || false;
      setBirthdayMode(isEnabled);
      
      if (isEnabled) {
        document.documentElement.classList.add("birthday-mode");
      } else {
        document.documentElement.classList.remove("birthday-mode");
      }
    };

    fetchBirthdayMode();

    // Subscribe to changes
    const channel = supabase
      .channel("user_preferences_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_preferences",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newBirthdayMode = (payload.new as any)?.birthday_mode || false;
          setBirthdayMode(newBirthdayMode);
          
          if (newBirthdayMode) {
            document.documentElement.classList.add("birthday-mode");
          } else {
            document.documentElement.classList.remove("birthday-mode");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { birthdayMode, setBirthdayModeForCurrentUser };
}
