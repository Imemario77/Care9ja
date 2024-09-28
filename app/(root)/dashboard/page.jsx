import ClientDashboard from "@/components/ClientDashboard";
import DoctorDashboard from "@/components/DoctorDashboard";
import { createClient } from "@/utils/supabase/server";
import React from "react";

async function Dashboard() {
  const supabase = createClient();
  const medical_report = null;

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .limit(1)
    .single();

  const {
    data: { count },
    error: unreadErr,
  } = await supabase
    .from("messages")
    .select("count")
    .eq("receiver_id", user?.id)
    .eq("seen", false)
    .limit(1)
    .single();

  console.log(count, "msg");

  const isDoctor = data.user_type === "doctor" ? true : false;
  let dcProfile = null;

  if (isDoctor) {
    const { data: doctor_account } = await supabase
      .from("doctorprofiles")
      .select("*")
      .eq("user_id", user?.id)
      .limit(1)
      .single();

    if (doctor_account) {
      dcProfile = doctor_account;
    }
  }

  if (!isDoctor) {
    const { data, error } = await supabase
      .from("medical_reports")
      .select(
        `
          *,
          patient:patient_id (full_name)
        `
      )
      .eq("patient_id", user.id)
      .neq("status", "Draft")
      .order("created_at", { ascending: false })
      .single();

    console.log(data);
  }

  return (
    <div>
      {isDoctor ? (
        <DoctorDashboard
          user={user}
          profile={data}
          unread={count || 0}
          dcProfile={dcProfile || null}
        />
      ) : (
        <ClientDashboard user={user} profile={data} unread={count || 0} />
      )}
    </div>
  );
}

export default Dashboard;
