"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default function AppointmentRequest({ user }) {
  const [loading, setLoading] = useState(false);
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Insert a new appointment request (not a booking)
    const { data: request, error: requestError } = await supabase
      .from("appointment_requests")
      .insert([
        {
          user_id: user.id, // Replace with actual patient ID
          appointment_type: appointmentType,
          notes,
          status: "pending", // Set as pending request initially
        },
      ]);

    setLoading(false);
    if (requestError) {
      console.error("Request Error:", requestError);
      toast.error("Error submitting appointment request");
      return;
    }

    toast.success("Appointment request submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Request an Appointment
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="appointmentType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Appointment Type
                      </label>
                      <select
                        id="appointmentType"
                        className="focus:ring-sky-500 focus:border-sky-500 block w-full py-3 sm:text-sm border-gray-300 rounded-md"
                        value={appointmentType}
                        onChange={(e) => setAppointmentType(e.target.value)}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="video">Video Call</option>
                        <option value="in-person">In-person</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Notes
                      </label>
                      <input
                        type="text"
                        id="notes"
                        className="focus:ring-sky-500 focus:border-sky-500 block w-full py-3 sm:text-sm border-gray-300 rounded-md"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
                    >
                      Request Appointment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
