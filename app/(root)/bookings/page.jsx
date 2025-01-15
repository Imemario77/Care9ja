import { createClient } from "@/utils/supabase/server";
import React from "react";
import AppointmentRequest from "./request_appointment";

async function Booking() {
  const supabase = createClient();

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  return (
    <div>
      <AppointmentRequest user={user} />
    </div>
  );
}

export default Booking;
