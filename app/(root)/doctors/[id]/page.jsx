import React from "react";
import { User, Phone, MapPin, Calendar, Award } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

// Mock data for demonstration
const mockDoctor = {
  id: "1",
  full_name: "Dr. John Doe",
  specialization: "Cardiology",
  license_number: "MD12345",
  years_of_experience: 10,
  bio: "Dr. John Doe is a board-certified cardiologist with over 10 years of experience in treating various heart conditions.",
  phone_number: "+1 (555) 123-4567",
  address: "123 Medical Center Dr, Healthville, NY 10001",
  profile_picture_url: "/api/placeholder/150/150",
};

export default async function DoctorProfilePage({ params }) {
  const supabase = createClient();

  const { data, error: err } = await supabase
    .from("doctorprofiles")
    .select(
      `
      *,
    user:id (
        *
      )
    `
    )
    .eq("id", params.id)
    .single();

  console.log(data);

  const doctor = data;

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto p-3 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={doctor.user.profile_picture_url}
              alt={doctor.user.full_name}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {doctor.specialization}
            </div>
            <h1 className="mt-1 text-3xl font-bold">{doctor.user.full_name}</h1>
            <p className="mt-2 text-gray-500">{doctor.bio}</p>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-gray-400 mr-2" />
              <span>License: {doctor.license_number}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span>Experience: {doctor.years_of_experience} years</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <span>{doctor.user.phone_number}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span>{doctor.user.address}</span>
            </div>
          </div>
        </div>
        <div className="px-8 py-4 flex  gap-4">
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Book Appointment
          </button>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Chat With Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
