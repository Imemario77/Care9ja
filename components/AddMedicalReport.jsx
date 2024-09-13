"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AddMedicalReport = ({ doctorId, patients }) => {
  const [report, setReport] = useState({
    title: "",
    patient_id: "",
    diagnosis: "",
    treatment_plan: "",
    notes: "",
    status: "Draft",
  });
  const supabase = createClient();
  const router = useRouter();

  const handleInputChange = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("medical_reports")
      .insert({ ...report, doctor_id: doctorId });

    if (error) {
      toast.error("Error adding medical report");
    } else {
      toast.success("Medical report added successfully");
      router.push("/medical-reports/view?id=" + report.patient_id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Add Medical Report
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Report Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    value={report.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="patient_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Patient
                  </label>
                  <select
                    id="patient_id"
                    name="patient_id"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                    value={report.patient_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.user.id} value={patient.user.id}>
                        {patient.user.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="diagnosis"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Diagnosis
                  </label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    rows={3}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    value={report.diagnosis}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="treatment_plan"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Treatment Plan
                  </label>
                  <textarea
                    id="treatment_plan"
                    name="treatment_plan"
                    rows={3}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    value={report.treatment_plan}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    value={report.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                    value={report.status}
                    onChange={handleInputChange}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    <Save className="mr-2 h-5 w-5" /> Save Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMedicalReport;
