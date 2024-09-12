"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Pill, Clock, Calendar, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const ClientMedicationRecords = ({ userId, patientMedications, isDoc }) => {
  const [medications, setMedications] = useState(patientMedications);
  const supabase = createClient();

  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("patient_id", userId)
      .order("updated_at", { ascending: true });

    if (error) {
      console.error("Error fetching medications:", error);
      toast.error("An error occured featching mediction");
    } else {
      setMedications(data);
    }
  };

  const deleteMedication = async (id) => {
    const { error } = await supabase.from("medications").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete medication:", error);
      toast.error("Failed to delete medication");
    } else {
      fetchMedications();
      toast.success("Medication deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Medication Records
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {medications.length === 0 ? (
                    <li className="px-4 py-4 sm:px-6">
                      <p className="text-sm text-gray-500">
                        No medications found.
                      </p>
                    </li>
                  ) : (
                    medications.map((medication) => (
                      <li key={medication.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-sky-600 truncate">
                              {medication.name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Pill className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {medication.dosage}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {medication.frequency == 1
                                  ? "Once daily"
                                  : medication.frequency + " times daily"}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>
                                Start: {medication.start_date || "N/A"}
                                {medication.end_date &&
                                  ` | End: ${medication.end_date}`}
                              </p>
                            </div>
                          </div>
                          {isDoc && (
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => deleteMedication(medication.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientMedicationRecords;
