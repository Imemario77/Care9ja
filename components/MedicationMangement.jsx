"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Pill, Clock, Calendar, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const MedicationManagement = ({ patientId, patientMedications }) => {
  const supabase = createClient();
  const [medications, setMedications] = useState(patientMedications || []);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    start_date: "",
    end_date: "",
  });

  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("patient_id", patientId);

    if (error) {
      console.error("Failed to fetch medications:", error);
      toast.error("An error occured featching mediction");
    } else {
      setMedications(data);
    }
  };

  const handleInputChange = (e) => {
    setNewMedication({ ...newMedication, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("medications")
      .insert({ ...newMedication, patient_id: patientId });

    if (error) {
      console.error("Failed to add medication:", error);
      toast.error("Failed to add medication");
    } else {
      console.log("Medication added successfully");
      toast.success("Medication added successfully");
      fetchMedications();
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        start_date: "",
        end_date: "",
      });
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("medications").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete medication:", error);
      toast.error("Failed to delete medication");
    } else {
      toast.success("Medication deleted successfully");
      fetchMedications();
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Medication Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-4 bg-white p-6 rounded-md shadow"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Medication Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newMedication.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="dosage"
            className="block text-sm font-medium text-gray-700"
          >
            Dosage
          </label>
          <input
            type="number"
            id="dosage"
            name="dosage"
            value={newMedication.dosage}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="frequency"
            className="block text-sm font-medium text-gray-700"
          >
            Frequency
          </label>
          <input
            type="number"
            id="frequency"
            name="frequency"
            value={newMedication.frequency}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={newMedication.start_date}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={newMedication.end_date}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Medication
        </button>
      </form>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {medications.map((medication) => (
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
                      {medication.end_date && ` | End: ${medication.end_date}`}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(medication.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MedicationManagement;
