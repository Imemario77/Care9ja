"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { createClient } from "../supabase/server";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const secret = process.env.STREAM_SECRET_KEY;

export const streamTokenProvider = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found");

  const client = new StreamClient(apiKey, secret, { timeout: 3000 });

  // validity is optional (by default the token is valid for an hour)
  const vailidity = 60 * 60;

  const token = client.generateUserToken({
    user_id: user?.id,
    validity_in_seconds: vailidity,
  });

  return token;
};



