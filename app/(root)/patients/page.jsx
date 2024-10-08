import DoctorPatientsList from "@/components/PatientsList";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

async function MyPatients() {
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
  } else {
    redirect("/doctors");
  }

  const { data, error } = await supabase
    .from("chats")
    .select(
      `
       user:patient_id (
          full_name,
          profile_picture_url,
          id
        )
      `
    )
    .eq("doctor_id", dc_id);

  console.log(data);

  return (
    <div>
      <DoctorPatientsList patients={data} />
    </div>
  );
}

export default MyPatients;
