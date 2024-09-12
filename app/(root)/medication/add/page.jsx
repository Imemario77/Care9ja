import MedicationManagement from "@/components/MedicationMangement";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function Add({ searchParams: { id } }) {
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

  const { data: chat_data, error: errf } = await supabase
    .from("chats")
    .select("*")
    .eq("doctor_id", doctor_account.id)
    .eq("patient_id", id)
    .limit(1)
    .single();

  if (!chat_data) {
    redirect("/dashboard");
  }

  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("patient_id", id);

  if (error) {
    console.error("Failed to fetch medications:", error);
  }

  console.log(data);

  return (
    <div className="p-6 bg-gray-100">
      <MedicationManagement patientId={id} patientMedications={data || []} />
    </div>
  );
}

export default Add;
