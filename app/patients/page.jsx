import DoctorPatientsList from "@/components/PatientsList";
import React from "react";

function MyPatients() {
  const isDoctor = false;
  return (
    <div>
      <DoctorPatientsList />
    </div>
  );
}

export default MyPatients;
