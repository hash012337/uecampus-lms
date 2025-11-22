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

      if (data?.birthday_mode) {
        setBirthdayMode(true);
        document.documentElement.classList.add("birthday-mode");
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
