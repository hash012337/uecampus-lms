import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useBirthdayMode() {
  const [birthdayMode, setBirthdayMode] = useState(false);
  const { user } = useAuth();

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

  return { birthdayMode };
}
