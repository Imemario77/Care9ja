"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Search,
  ChevronDown,
} from "lucide-react";
import { parseTimestamp } from "@/utils/functions";

export default function AppointmentsPage({ appointments }) {
  const [filter, setFilter] = useState("scheduled");

  const filteredAppointments = appointments.filter(
    (appointment) => filter === "all" || appointment.status === filter
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Your Appointments
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="mb-6 flex justify-between items-center">
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Appointments</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredAppointments.length <= 0 && (
                    <div className="px-4 py-4 sm:px-6">
                      <p className="flex items-center text-sm text-gray-500">
                        {filter !== "all"
                          ? `No ${filter} appointment`
                          : "No appointment"}
                      </p>
                    </div>
                  )}
                  {filteredAppointments.map((appointment) => (
                    <li key={appointment.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-sky-600 truncate">
                              {appointment.user.specialization && "Dr. "}
                              {appointment.user.full_name}
                            </p>
                            {appointment.user.specialization && (
                              <p className="ml-2 text-sm text-gray-500">
                                {appointment.user.specialization}
                              </p>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.appointment_type === "video"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
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
                              {parseTimestamp(appointment?.start_time).date}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {parseTimestamp(appointment?.start_time).time}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {appointment.appointment_type === "video" ? (
                              <Video className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            ) : (
                              <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            )}
                            {appointment.appointment_type === "video"
                              ? "Join Call"
                              : "Get Directions"}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
