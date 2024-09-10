import React from "react";
import {
  Calendar,
  Clock,
  MessageCircle,
  FileText,
  Activity,
  User,
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboard({ profile, user }) {
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      time: "10:00 AM",
      date: "2024-08-30",
      type: "Video Call",
    },
    {
      id: 2,
      doctorName: "Dr. Michael Lee",
      time: "2:30 PM",
      date: "2024-09-02",
      type: "In-person",
    },
  ];

  const medications = [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  ];

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
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {upcomingAppointments[0].date} at{" "}
                            {upcomingAppointments[0].time}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        View all appointments
                      </a>
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
                            3 unread
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        Open messages
                      </a>
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
                      <a
                        href="#"
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        View records
                      </a>
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
                    {upcomingAppointments.map((appointment) => (
                      <li key={appointment.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-sky-600 truncate">
                              {appointment.doctorName}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {appointment.type}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {appointment.date}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {appointment.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Current Medications
                    </h3>
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
                                <Activity className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
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
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Start Chat Consultation
                    </button>
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
