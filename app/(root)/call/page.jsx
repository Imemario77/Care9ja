import VideoChatInterface from "@/components/VideoCallInterface";
import StreamVideoProvider from "@/utils/providers/streamVideoProvider";
import { createClient } from "@/utils/supabase/server";
import React from "react";

async function VideoCall() {
  const supabase = createClient();
  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();
  return (
    <div>
      <StreamVideoProvider>
        <VideoChatInterface userData={user} />
      </StreamVideoProvider>
    </div>
  );
}

export default VideoCall;
