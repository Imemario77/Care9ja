import AppointmentBooking from "@/components/ApointmentBooking";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

async function Booking({ searchParams: { id } }) {
  const supabase = createClient();

  if (!id || id === undefined) {
    redirect("/admin/appointments");
  }

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("doctorprofiles").select(`
       id, 
      user:user_id (
        full_name
      )
    `);

  console.log(data);

  const { data: request_appoitment, error: meik } = await supabase
    .from("appointment_requests")
    .select("user_id, appointment_type, user:user_id(full_name)")
    .eq("id", id)
    .single();

  if (!request_appoitment) {
    redirect("/admin/appointments");
  }

  return (
    <div>
      <AppointmentBooking user={request_appoitment} doctors={data} />
    </div>
  );
}

export default Booking;
