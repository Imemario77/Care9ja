"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function ClientOnboarding({ user }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter();
  const imgRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    bloodType: "",
    medicalConditions: "",
    medications: "",
    allergies: "",
    profilePicture: null,
    address: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const supabase = createClient();

  useEffect(() => {
    if (formData.profilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(formData.profilePicture);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.profilePicture]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateStep = (currentStep) => {
    let stepErrors = {};
    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim())
          stepErrors.fullName = "Full Name is required";
        if (!formData.dateOfBirth)
          stepErrors.dateOfBirth = "Date of Birth is required";
        if (!formData.gender) stepErrors.gender = "Gender is required";
        if (!formData.phoneNumber.trim())
          stepErrors.phoneNumber = "Phone Number is required";
        break;
      case 2:
        if (!formData.height) stepErrors.height = "Height is required";
        if (!formData.weight) stepErrors.weight = "Weight is required";
        if (!formData.bloodType)
          stepErrors.bloodType = "Blood Type is required";
        if (!formData.address.trim())
          stepErrors.address = "Address is required";
        break;
      case 3:
        // These fields are optional, so no validation is needed
        break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setLoading(true);
      try {
        let profilePictureUrl = "";
        if (formData.profilePicture) {
          const fileName = `profile/${uuidv4()}_${
            formData.profilePicture.name
          }`;
          const { data, error: uploadError } = await supabase.storage
            .from("IMG")
            .upload(fileName, formData.profilePicture);

          if (uploadError) {
            throw new Error(uploadError.message);
          }
          const {
            data: { publicUrl },
            error: urlError,
          } = supabase.storage.from("IMG").getPublicUrl(fileName);
          profilePictureUrl = publicUrl;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            full_name: formData.fullName,
            user_type: "patient",
            date_of_birth: formData.dateOfBirth,
            profile_picture_url: profilePictureUrl,
            phone_number: formData.phoneNumber,
            address: formData.address,
            gender: formData.gender,
          })
          .select("id");

        if (userError) {
          console.error("Error inserting into Users:", userError);
          throw Error(userError.message);
        }

        const { error: patientError } = await supabase
          .from("patientprofiles")
          .insert({
            id: userData[0].id,
            height: formData.height,
            weight: formData.weight,
            blood_type: formData.bloodType,
            medical_conditions: formData.medicalConditions,
            current_medications: formData.medications,
            allergies: formData.allergies,
          });

        if (patientError) {
          console.error(
            "Error inserting into PatientProfiles:",
            patientError.message
          );
          throw Error(patientError);
        }

        toast.success("Onboarding completed successfully!");
        router.push("/dashboard");
      } catch (error) {
        console.error("Unexpected error during submission:", error);
        toast.error("An error occurred. Please try again");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.dateOfBirth && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700"
              >
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.height ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.height && (
                <p className="mt-2 text-sm text-red-600">{errors.height}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.weight && (
                <p className="mt-2 text-sm text-red-600">{errors.weight}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="bloodType"
                className="block text-sm font-medium text-gray-700"
              >
                Blood Type
              </label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.bloodType ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodType && (
                <p className="mt-2 text-sm text-red-600">{errors.bloodType}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              ></textarea>
              {errors.address && (
                <p className="mt-2 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="medicalConditions"
                className="block text-sm font-medium text-gray-700"
              >
                Existing Medical Conditions
              </label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                rows={3}
                value={formData.medicalConditions}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="List any existing medical conditions..."
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="medications"
                className="block text-sm font-medium text-gray-700"
              >
                Current Medications
              </label>
              <textarea
                id="medications"
                name="medications"
                rows={3}
                value={formData.medications}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="List any current medications..."
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="allergies"
                className="block text-sm font-medium text-gray-700"
              >
                Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={3}
                value={formData.allergies}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="List any allergies..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Camera className="h-full w-full text-gray-300" />
                  )}
                </span>
                <input
                  type="file"
                  className="hidden"
                  name="profilePicture"
                  ref={imgRef}
                  onChange={handleChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => imgRef.current.click()}
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Patient Onboarding
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {step} of 3
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            {renderStep()}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Complete"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
