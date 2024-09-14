"use client";

import React, { useEffect, useState, useRef } from "react";

import { createClient } from "@/utils/supabase/client";
import { streamTokenProvider } from "@/utils/actions/createStream";

import {
  CallControls,
  CallingState,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const VideoCallInterface = ({ callId }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const initializeClient = async () => {
      const {
        data: { user },
        error: err,
      } = await supabase.auth.getUser();
      if (err) {
        console.error("Error getting user:", err);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error getting user:", error);
        return;
      }
      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
      const streamClient = new StreamVideoClient({
        apiKey,
        user: {
          id: user.id,
          name: data.full_name,
          image: data.profile_picture_url,
        },
        token: await streamTokenProvider(user.id),
      });

      setClient(streamClient);

      const setUpCall = streamClient.call("default", callId);
      setUpCall.join({ create: true });
      // setUpCall.getOrCreate();

      setCall(setUpCall);
    };

    initializeClient();
  }, [callId]);

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
};

export const MyUILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  console.log(callingState);
  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};

export default VideoCallInterface;
