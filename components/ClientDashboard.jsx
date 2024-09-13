import React from "react";
import {
  Calendar,
  Clock,
  MessageCircle,
  FileText,
  User,
  Pill,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { formatDate, parseTimestamp } from "@/utils/functions";

export default async function ClientDashboard({ profile, user, unread }) {
  const supabase = createClient();

  // get the total meeting for today
  const todayTime = new Date(new Date());

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `id,
      appointment_type,
      status,
      start_time,
      user:doctor_id (
      user:user_id(
        full_name,
        id
        )
      )
      `
    )
    .eq("patient_id", user?.id)
    .gte("start_time", formatDate(todayTime))
    .limit(2);

  const { data: medications, error } = await supabase
    .from("medications")
    .select("*")
    .eq("patient_id", user?.id)
    .order("updated_at", { ascending: false })
    .limit(2);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Welcome, {profile.full_name}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Next Appointment
                          </dt>
                          {appointments.length >= 1 ? (
                            <dd className="mt-1 text-lg font-semibold text-gray-900">
                              {parseTimestamp(appointments[0].start_time).date}{" "}
                              at{" "}
                              {parseTimestamp(appointments[0].start_time).time}
                            </dd>
                          ) : (
                            <dd className="mt-1 text-lg font-semibold text-gray-900">
                              No Upcoming Meeting
                            </dd>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link
                        href="appointments"
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        View all appointments
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Messages
                          </dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {unread} unread
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link
                        href="messages"
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        Open messages
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Medical Records
                          </dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            Last updated: 2024-08-15
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link
                        href={`/medical-reports/view?id=${user.id}`}
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        View records
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Upcoming Appointments
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {appointments.length <= 0 && (
                      <div className="px-4 py-4 sm:px-6">
                        <p className="flex items-center text-sm text-gray-500">
                          No appointment
                        </p>
                      </div>
                    )}
                    {appointments.map((appointment) => (
                      <li key={appointment.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-sky-600 truncate">
                              {appointment.user.user.full_name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {appointment.appointment_type === "video"
                                  ? "Video call"
                                  : "In-person"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {
                                  parseTimestamp(appointments[0].start_time)
                                    .date
                                }
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {
                                  parseTimestamp(appointments[0].start_time)
                                    .time
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 sm:px-6 flex justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Current Medications
                    </h3>
                    <Link
                      href={`medication/view?id=${user?.id}`}
                      className="font-medium text-sky-700 hover:text-sky-900"
                    >
                      View all medications
                    </Link>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {medications.map((medication) => (
                      <li key={medication.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {medication.name}
                            </p>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Pill className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {medication.dosage}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {medication.frequency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link
                      href="bookings"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      <User className="mr-2 h-5 w-5" />
                      Book Appointment
                    </Link>
                    <Link
                      href="messages"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Start Chat Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
