"use client";

import { useState } from "react";
import ClientOnboarding from "@/components/ClientOnboarding";
import DoctorOnboarding from "@/components/DoctorOnboarding";
import React from "react";
import { UserRound, Stethoscope } from "lucide-react";

function OnboardingWrapper({ user }) {
  const [isDoctor, setIsDoctor] = useState(null);

  if (isDoctor === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Onboarding
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up as a Doctor or Patient
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flex md:flex-row flex-col justify-center gap-4">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex flex-col items-center space-y-4">
              <Stethoscope size={48} className="text-sky-600" />
              <button
                onClick={() => setIsDoctor(true)}
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <span className="mr-2">Doctor</span>
                <Stethoscope size={16} />
              </button>
            </div>
          </div>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex flex-col items-center space-y-4">
              <UserRound size={48} className="text-gray-600" />
              <button
                onClick={() => setIsDoctor(false)}
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <span className="mr-2">Patient</span>
                <UserRound size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      {isDoctor ? (
        <DoctorOnboarding user={user} />
      ) : (
        <ClientOnboarding user={user} />
      )}
    </div>
  );
}

export default OnboardingWrapper;
