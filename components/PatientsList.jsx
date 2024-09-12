"use client";

import React, { useState } from "react";
import { Search, User, Plus, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DoctorPatientsList({ patients }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              My Patients
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="mb-4">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search patients"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredPatients.length <= 0 && (
                    <div className="px-4 py-4 sm:px-6">
                      <p className="flex items-center text-sm text-gray-500">
                        No Paitient
                      </p>
                    </div>
                  )}
                  {filteredPatients.map((patient) => (
                    <li key={patient.user.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {patient.user.profile_picture_url ? (
                                <Image
                                  className="h-10 w-10 rounded-full bg-gray-200"
                                  width="40"
                                  height="40"
                                  src={patient.user.profile_picture_url}
                                />
                              ) : (
                                <User className="h-10 w-10 rounded-full bg-gray-200 p-2" />
                              )}
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-sky-600">
                                {patient.user.full_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Age: {patient.age || 20}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`medication/add?id=${patient.user.id}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                            >
                              <Plus className="h-5 w-5 text-gray-400" />
                            </Link>
                            <Link
                              href={`medication/view?id=${patient.user.id}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                            >
                              <Eye className="h-5 w-5 text-gray-400" />
                            </Link>
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
