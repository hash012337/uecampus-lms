import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useBirthdayMode() {
  const [birthdayMode, setBirthdayMode] = useState(false);
  const { user } = useAuth();

  const setBirthdayModeForCurrentUser = async (enabled: boolean) => {
    if (!user) return;

    setBirthdayMode(enabled);

    if (enabled) {
      document.documentElement.classList.add("birthday-mode");
    } else {
      document.documentElement.classList.remove("birthday-mode");
    }

    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: user.id,
          birthday_mode: enabled,
        },
        { onConflict: "user_id" }
      );

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
