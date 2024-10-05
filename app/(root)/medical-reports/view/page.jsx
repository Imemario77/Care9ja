import ViewMedicalReports from "@/components/ViewMedicalReports";
import { createClient } from "@/utils/supabase/server";

async function View({ searchParams: { id } }) {
  const supabase = createClient();

  let isDoc = false;
  let medicalReportData = null;

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

    console.log(doctor_account);
    const { data, error } = await supabase
      .from("medical_reports")
      .select(
        `
          *,
          patient:patient_id (full_name)
        `
      )
      .eq("doctor_id", doctor_account.id)
      .eq("patient_id", id)
      .order("created_at", { ascending: false });

    console.log(data);
    medicalReportData = data;
  } else {
    const { data, error } = await supabase
      .from("medical_reports")
      .select(
        `
          *,
          patient:patient_id (full_name)
        `
      )
      .eq("patient_id", id)
      .neq("status", "Draft")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch medications:", error);
    }

    medicalReportData = data;
  }

  console.log(medicalReportData);

  console.log(isDoc);
  return <ViewMedicalReports reports={medicalReportData} id={id} />;
}

export default View;
