"use client";

import React, { useState } from "react";
import { Search, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function DoctorsList({ doctorList }) {
  const [doctors, setDoctors] = useState(doctorList || []);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex">
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow mr-2 px-4 py-2 border border-gray-300 rounded-md"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
          <Search className="h-4 w-4 mr-2" />
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Link href={`/doctors/${doctor.id}`} key={doctor.id}>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={doctor.user.profile_picture_url}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    width={100}
                    height={100}
                  />
                  <User className="h-12 w-12 text-gray-400 mr-4" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">
                    {doctor.user.full_name}
                  </h2>
                  <p className="text-gray-600">{doctor.specialization}</p>
                </div>
              </div>
              <p className="text-gray-700">
                Experience: {doctor.years_of_experience} years
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DoctorsList;
