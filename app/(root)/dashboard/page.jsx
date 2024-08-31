import ClientDashboard from "@/components/ClientDashboard";
import DoctorDashboard from "@/components/DoctorDashboard";
import { createClient } from "@/utils/supabase/server";
import React from "react";

async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .limit(1)
    .single();

  const isDoctor = data.user_type === "doctor" ? true : false;

  return (
    <div>
      {isDoctor ? (
        <DoctorDashboard user={user} profile={data} />
      ) : (
        <ClientDashboard user={user} profile={data} />
      )}
    </div>
  );
}

export default Dashboard;
