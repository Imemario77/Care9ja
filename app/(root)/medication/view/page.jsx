import ClientMedicationRecords from "@/components/ClientMedicationRecords";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function View({ searchParams: { id } }) {
  const supabase = createClient();

  let isDoc = false;
  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  if (user.id !== id) {
    const { data: doctor_account } = await supabase
      .from("doctorprofiles")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!doctor_account) {
      redirect("/doctors");
    }
    isDoc = true;
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
  }

  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("patient_id", id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch medications:", error);
  }


  return (
    <ClientMedicationRecords
      patientMedications={data || []}
      userId={id}
      isDoc={isDoc}
    />
  );
}

export default View;
