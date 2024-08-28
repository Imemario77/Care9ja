import ClientDashboard from "@/component/ClientDashboard";
import DoctorDashboard from "@/component/DoctorDashboard";
import React from "react";

function Dashboard() {
  const isDoctor = true;

  return <div>{isDoctor ? <DoctorDashboard /> : <ClientDashboard />}</div>;
}

export default Dashboard;
