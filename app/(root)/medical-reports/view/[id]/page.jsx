import ViewSingleMedicalReport from "@/components/ViewSingleMedicalReport ";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function ViewSingle({ params: { id } }) {
  const supabase = createClient();

  let isDoc = false;
  let medicalReportData = null;

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  const { data: reportData, error } = await supabase
    .from("medical_reports")
    .select(
      `
          *,
          patient:patient_id (full_name,id),
          doctor:doctor_id(user_id)
        `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch medications:", error);
  }

  console.log("error", error);

  console.log(reportData);

  if (reportData.doctor.user_id === user.id) {
    isDoc = true;
  } else if (reportData.patient_id === user.id) {
    isDoc = false;
  } else {
    redirect("/dashboard");
  }

  console.log(isDoc);
  return <ViewSingleMedicalReport reportData={reportData} isDoc={isDoc} />;
}

export default ViewSingle;
