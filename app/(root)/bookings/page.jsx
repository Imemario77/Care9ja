import AppointmentBooking from "@/components/ApointmentBooking";
import { createClient } from "@/utils/supabase/server";
import React from "react";

async function Booking() {
  const supabase = createClient();

  const { 
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("chats")
    .select(
      `
      doctor_id,
      doctor:doctor_id(
        user:user_id (
          full_name
        )
      )
      `
    )
    .eq("patient_id", user.id);

  return (
    <div>
      <AppointmentBooking user={user} doctors={data} />
    </div>
  );
}

export default Booking;
