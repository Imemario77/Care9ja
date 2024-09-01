import React from "react";
import { Phone, MapPin, Calendar, Award } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import DoctorProfileActionButton from "@/components/DoctorProfileActionButton";

export default async function DoctorProfilePage({ params: { id } }) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { data, error: err } = await supabase
    .from("doctorprofiles")
    .select(
      `
      *,
    user:user_id (
        *
      )
    `
    )
    .eq("id", id)
    .single();

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
        <DoctorProfileActionButton patientId={user.id} doctorId={id} />
      </div>
    </div>
  );
}
