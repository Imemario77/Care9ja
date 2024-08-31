"use client";

import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";

const supabase = createClient();

function useSupabaseUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user: supabaseUser },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(supabaseUser);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setUser(session?.user ?? null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export default useSupabaseUser;
