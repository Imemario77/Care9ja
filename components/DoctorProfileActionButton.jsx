"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function DoctorProfileActionButton({ patientId, doctorId }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Function to check if a chat exists between patient and doctor
  async function checkOrCreateChat(patientId, doctorId) {
    // Check if a chat already exists
    const { data: existingChats, error: fetchError } = await supabase
      .from("chats")
      .select("id")
      .eq("doctor_id", doctorId)
      .eq("patient_id", patientId);

    if (fetchError) {
      console.error("Error fetching chat:", fetchError);
      return null;
    }

    // If a chat exists, return the chat ID
    if (existingChats.length > 0) {
      return existingChats[0].id;
    }

    // If no chat exists, create a new one
    const { data: newChat, error: createError } = await supabase
      .from("chats")
      .insert({ doctor_id: doctorId, patient_id: patientId })
      .select("id")
      .single();

    if (createError) {
      console.error("Error creating chat:", createError);
      return null;
    }

    return newChat.id;
  }

  const handleClick = async () => {
    setLoading(true); // Start loading state
    const result = await checkOrCreateChat(patientId, doctorId);
    setLoading(false); // End loading state

    if (result == null) {
      toast.error(
        "An error occurred while setting up the chat environment. Please try again."
      );
      return;
    }

    router.push(`/messages?id=${result}`);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => router.push(`/book-appointment/${doctorId}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        disabled={loading}
      >
        Book Appointment
      </button>
      <button
        onClick={handleClick}
        className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading && (
          <svg
            className="w-5 h-5 mr-2 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 2V1a11 11 0 0 0-11 11h1a10 10 0 0 1 10-10zm0 20v-1a10 10 0 0 1-10-10h-1a11 11 0 0 0 11 11zm9-11a10 10 0 0 1-10 10v1a11 11 0 0 0 11-11h-1zM12 2V1a11 11 0 0 0-11 11h1a10 10 0 0 1 10-10zm0 20v-1a10 10 0 0 1-10-10h-1a11 11 0 0 0 11 11zm9-11a10 10 0 0 1-10 10v1a11 11 0 0 0 11-11h-1z" />
          </svg>
        )}
        {loading ? "Starting Chat..." : "Start Chat Consultation"}
      </button>
    </div>
  );
}

export default DoctorProfileActionButton;
