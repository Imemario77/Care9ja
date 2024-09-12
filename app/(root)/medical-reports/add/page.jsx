import AddMedicalReport from "@/components/AddMedicalReport";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function Add() {
  const supabase = createClient();

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  const { data: doctor_account } = await supabase
    .from("doctorprofiles")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!doctor_account) {
    redirect("/doctors");
  }

  const { data, error } = await supabase
    .from("chats")
    .select(
      `user:patient_id (
          full_name,
          id
    )`
    )
    .eq("doctor_id", doctor_account.id);

  if (error) {
    console.error("Error fetching patients:", error);
  }

  return (
    <AddMedicalReport patients={data || []} doctorId={doctor_account.id} />
  );
}

export default Add;
