"use client";

import React, { useState } from "react";
import { Calendar, Clock, VideoIcon, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/functions";

export default function AppointmentBooking({ user, doctors }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert selected date and time to a JavaScript Date object
    const startDate = new Date(`${selectedDate}T${selectedTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assuming 1-hour appointment


    const startTime = formatDate(startDate);
    const endTime = formatDate(endDate);

    console.log("Doctor ID:", doctorId);

    // Check if the doctor exists
    const { data: doctors, error: doctorError } = await supabase
      .from("doctorprofiles")
      .select("id")
      .eq("id", doctorId)
      .single();

    if (doctorError || !doctors) {
      toast.error("Doctor not found");
      return;
    }

    // Check for existing appointments with a buffer
    const bufferMinutes = 5;
    const bufferMilliseconds = bufferMinutes * 60 * 1000;
    const rangeStart = new Date(startDate.getTime() - bufferMilliseconds);
    const rangeEnd = new Date(endDate.getTime() + bufferMilliseconds);

    const rangeStartStr = formatDate(rangeStart);
    const rangeEndStr = formatDate(rangeEnd);

    console.log("Range Start:", rangeStartStr);
    console.log("Range End:", rangeEndStr);

    const { data: existingAppointments, error: appointmentError } =
      await supabase
        .from("appointments")
        .select("id, start_time, end_time")
        .eq("doctor_id", doctorId)
        .lte("start_time", rangeEndStr)
        .gte("end_time", rangeStartStr);

    console.log("Existing Appointments:", existingAppointments);
    if (appointmentError) {
      toast.error("Error checking doctor's availability");
      console.error("Appointment Error:", appointmentError);
      return;
    }

    if (existingAppointments && existingAppointments.length > 0) {
      toast.error("Doctor is not available at the selected time");
      return;
    }

    // Create appointment
    const { data: appointment, error: bookingError } = await supabase
      .from("appointments")
      .insert([
        {
          doctor_id: doctorId,
          patient_id: user.id, // Replace with actual patient ID
          start_time: startTime,
          end_time: endTime,
          appointment_type: appointmentType,
          status: "scheduled",
          notes, // Add any additional notes if needed
        },
      ]);

    if (bookingError) {
      console.error("Booking Error:", bookingError);
      toast.error("Error booking the appointment");
      return;
    }

    toast.success("Appointment booked successfully");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Book an Appointment
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="date"
                          className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 py-3 outline-none sm:text-sm border-gray-300 rounded-md"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Time
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          id="time"
                          className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10  py-3 outline-none  sm:text-sm border-gray-300 rounded-md"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="appointmentType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Appointment Type
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <VideoIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="appointmentType"
                          className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 py-3 outline-none  sm:text-sm border-gray-300 rounded-md"
                          value={appointmentType}
                          onChange={(e) => setAppointmentType(e.target.value)}
                          required
                        >
                          <option value="">Select type</option>
                          <option value="video">Video Call</option>
                          <option value="in-person">In-person</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="doctorId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Doctor
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="doctorId"
                          className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10  py-3 outline-none sm:text-sm border-gray-300 rounded-md"
                          value={doctorId}
                          onChange={(e) => setDoctorId(e.target.value)}
                          required
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map((doc) => (
                            <option key={doc.doctor_id} value={doc.doctor_id}>
                              {doc?.doctor?.user?.full_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Notes
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="notes"
                          className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 py-3 outline-none  sm:text-sm border-gray-300 rounded-md"
                          placeholder="Notes....."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      >
                        Book Appointment
                      </button>
                    </div>
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
