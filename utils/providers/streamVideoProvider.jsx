"use client";

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import useSupabaseUser from "../hooks/useSupabaseUser";
import { streamTokenProvider } from "@/utils/actions/createStream";
import { createClient } from "../supabase/client";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }) => {
  const [videoCLient, SetVideoClient] = useState();
  const [userData, setUserData] = useState();
  const supabase = createClient();
  const { user, loading } = useSupabaseUser();

  useEffect(() => {
    return async () => {
      if (!loading && !user) return;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .limit(1)
        .single();

      if (data) setUserData(data);
    };
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !user) return;
    if (!apiKey) throw new Error("No Stream Api Key Detected");
    if (user) {
      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: user?.id,
          name: userData?.full_name,
          image: userData?.profile_picture_url,
        },
        token: streamTokenProvider,
      });

      SetVideoClient(client);
    }
  }, [user, userData]);

  if (!videoCLient) return <p>Loading....</p>;

  return <StreamVideo client={videoCLient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
