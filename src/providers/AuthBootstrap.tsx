import { PropsWithChildren, useEffect } from "react";

import { getSupabaseClient } from "@/lib/supabase";
import { useAppStore } from "@/store/appStore";

export function AuthBootstrap({ children }: PropsWithChildren) {
  const setSession = useAppStore((state) => state.setSession);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const nextSession = data.session;

      if (nextSession?.user) {
        setSession({
          id: nextSession.user.id,
          email: nextSession.user.email ?? "",
          displayName: nextSession.user.user_metadata.full_name ?? nextSession.user.email ?? "Athlete"
        });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession?.user) {
        setSession(null);
        return;
      }

      setSession({
        id: nextSession.user.id,
        email: nextSession.user.email ?? "",
        displayName: nextSession.user.user_metadata.full_name ?? nextSession.user.email ?? "Athlete"
      });
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setSession]);

  return children;
}
