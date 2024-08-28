import ClientOnboarding from "@/components/ClientOnboarding";
import DoctorOnboarding from "@/components/DoctorOnboarding";
import React from "react";

function Onboarding() {
  const isDoctor = false;
  return <div>{isDoctor ? <DoctorOnboarding /> : <ClientOnboarding />}</div>;
}

export default Onboarding;
