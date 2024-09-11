import React from "react";
import { Calendar, Users, MessageCircle, FileText } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { formatDate, parseTimestamp } from "@/utils/functions";

export default async function DoctorDashboard({ profile, user, dcProfile }) {
  const supabase = createClient();

  //  get the count of patient's
  const {
    data: { count },
    error,
  } = await supabase
    .from("chats")
    .select("count")
    .eq("doctor_id", dcProfile?.id)
    .single();

  // get the total meeting for today

  const todayTime = new Date(new Date().setHours(0, 0, 0, 0));
  const tommorowTime = new Date(new Date().setHours(24, 0, 0, 0));

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `id,
      appointment_type,
      status,
      start_time,
      user:patient_id (
          full_name,
          id
      )
      `
    )
    .eq("doctor_id", dcProfile?.id)
    .lte("start_time", formatDate(tommorowTime))
    .gte("start_time", formatDate(todayTime));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Today's Appointments
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {appointments?.length || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Patients
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {count || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/messages"
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Unread Messages
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            5
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Pending Reports
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            7
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Today's Appointments
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <li key={appointment?.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-sky-600 truncate">
                              {appointment.user.full_name}
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
                                {parseTimestamp(appointment.start_time)?.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
