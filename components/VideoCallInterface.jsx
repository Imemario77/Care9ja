"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { streamTokenProvider } from "@/utils/actions/createStream";
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useRouter } from "next/navigation";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

let streamClient = null;
let call = null;

const initializeStreamClient = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error getting user:", userError);
    return null;
  }

  const { data: userData, error: dataError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (dataError) {
    console.error("Error getting user data:", dataError);
    return null;
  }

  const token = await streamTokenProvider(user.id);

  streamClient = new StreamVideoClient({
    apiKey,
    user: {
      id: user.id,
      name: userData.full_name,
      image: userData.profile_picture_url,
    },
    token,
  });

  return streamClient;
};

const VideoCallInterface = ({ callId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const setupCall = async () => {
      if (!streamClient) {
        streamClient = await initializeStreamClient();
      }

      if (streamClient && !call) {
        call = streamClient.call("default", callId);
        await call.join({ create: true });
      }

      setIsLoading(false);
    };

    setupCall();
  }, [callId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const handleCallEnd = () => {
    router.push("/dashboard"); // Redirect to dashboard
  };

  return (
    <StreamVideo client={streamClient}>
      <StreamCall call={call}>
        <MyUILayout onCallEnd={handleCallEnd} />
      </StreamCall>
    </StreamVideo>
  );
};

const MyUILayout = ({ onCallEnd }) => {
  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls onLeave={onCallEnd} />
    </StreamTheme>
  );
};

export default VideoCallInterface;
