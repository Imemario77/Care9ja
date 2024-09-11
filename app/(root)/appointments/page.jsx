import AppointmentsPage from "@/components/AppointmentsListPage";
import { createClient } from "@/utils/supabase/server";
import { useFormatedData } from "@/utils/functions";
import React from "react";

async function AppointmentListPage() {
  const supabase = createClient();

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  let dc_id = null;

  const { data: doctor_account } = await supabase
    .from("doctorprofiles")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (doctor_account) {
    dc_id = doctor_account.id;
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_type,
      status,
      start_time,
      ${
        !dc_id
          ? `user:doctor_id (
        specialization,
        user:user_id (
        full_name,
        id
        )
        `
          : `user:patient_id (
          full_name,
          id
          )`
      }
      )
    `
    )
    .or(`doctor_id.eq.${dc_id || user.id},patient_id.eq.${user.id}`);

  return (
    <div>
      <AppointmentsPage appointments={useFormatedData(data) || []} />
    </div>
  );
}

export default AppointmentListPage;
