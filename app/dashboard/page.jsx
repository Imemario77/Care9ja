import ClientDashboard from "@/components/ClientDashboard";
import DoctorDashboard from "@/components/DoctorDashboard";
import React from "react";

function Dashboard() {
  const isDoctor = true;

  return <div>{isDoctor ? <DoctorDashboard /> : <ClientDashboard />}</div>;
}

export default Dashboard;
