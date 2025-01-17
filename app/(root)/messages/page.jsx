import React from "react";
import ChatInterface from "@/components/ChatInterface";
import { createClient } from "@/utils/supabase/server";

async function Chat({ searchParams: { id } }) {
  const supabase = createClient();

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  let dc_id = null;
  let activeAccount = null;
  let chat_data = null;

  const { data: doctor_account } = await supabase
    .from("doctorprofiles")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (doctor_account) {
    dc_id = doctor_account.id;
  }

  if (user.role === "service_role") {
    const { data: new_chat_data, error } = await supabase
      .from("chats")
      .select(
        `
    id,
    user:patient_id (
          full_name,
          profile_picture_url,
          id
          )
  `
      )
      .eq("admin_id", user.id);

    chat_data = new_chat_data;
  } else {
    const { data: new_chat_data, error } = await supabase
      .from("chats")
      .select(
        `
      id,
      ${
        !dc_id
          ? ` user:doctor_id (
        specialization,
        user:user_id (
        full_name,
        profile_picture_url,
        id
        `
          : `user:patient_id (
          full_name,
          profile_picture_url,
          id
          )`
      }
        )
      )
    `
      )
      .or(`doctor_id.eq.${dc_id || user.id},patient_id.eq.${user.id}`);

    chat_data = new_chat_data;
  }

  if (id) {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
      id,
      ${
        !dc_id
          ? ` user:doctor_id (
        specialization,
        user:user_id (
        full_name,
        profile_picture_url,
        id
        `
          : `user:patient_id (
          full_name,
          profile_picture_url,
          id
          )`
      }
        )
      )
    `
      )
      .eq("id", id)
      .single();
    activeAccount = data;
  }

  console.log("chat_data");
  console.log(chat_data);

  return (
    <div className="h-screen  absolute top-0 w-full">
      <ChatInterface
        accounts={chat_data || []}
        activeAccount={activeAccount}
        userId={user.id}
      />
    </div>
  );
}

export default Chat;
