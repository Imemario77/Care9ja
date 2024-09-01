"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DoctorOnboarding({ user }) {
  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    bio: "",
    profilePicture: null,
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const supabase = createClient();
  const router = useRouter();

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
        if (!formData.specialization.trim())
          stepErrors.specialization = "Specialization is required";
        if (!formData.dateOfBirth)
          stepErrors.dateOfBirth = "Date of Birth is required";
        if (!formData.gender) stepErrors.gender = "Gender is required";
        break;
      case 2:
        if (!formData.licenseNumber.trim())
          stepErrors.licenseNumber = "License Number is required";
        if (!formData.yearsOfExperience)
          stepErrors.yearsOfExperience = "Years of Experience is required";
        if (!formData.phoneNumber.trim())
          stepErrors.phoneNumber = "Phone Number is required";
        break;
      case 3:
        if (!formData.bio.trim())
          stepErrors.bio = "Professional Bio is required";
        if (!formData.address.trim())
          stepErrors.address = "Address is required";
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
        // Upload profile picture if exists
        let profilePictureUrl = "";
        if (formData.profilePicture) {
          let fileName = `profile/${uuidv4()}_${formData.profilePicture.name}`;
          const { data, error: uploadError } = await supabase.storage
            .from("IMG")
            .upload(fileName, formData.profilePicture);

          if (uploadError) {
            throw new Error(uploadError.message);
          }
          // Get the public URL of the uploaded file
          const {
            data: { publicUrl },
            error: urlError,
          } = supabase.storage.from("IMG").getPublicUrl(fileName);
          profilePictureUrl = publicUrl;
        }

        // Insert data into Users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            full_name: formData.fullName,
            user_type: "doctor",
            profile_picture_url: profilePictureUrl,
            date_of_birth: formData.dateOfBirth,
            phone_number: formData.phoneNumber,
            address: formData.address,
            gender: formData.gender,
          })
          .select("id");

        if (userError) {
          throw new Error(userError.message);
        }

        // Insert data into DoctorProfiles table
        const { error: profileError } = await supabase
          .from("doctorprofiles")
          .insert({
            user_id: userData[0].id,
            specialization: formData.specialization,
            license_number: formData.licenseNumber,
            years_of_experience: formData.yearsOfExperience,
            bio: formData.bio,
          });

        if (profileError) {
          throw new Error(profileError.message);
        }

        toast.success("Onboarding completed successfully!");

        router.push("/dashboard");
      } catch (error) {
        console.error("Unexpected error during submission:", error);
        toast.error("An error occurred. Please try again.");
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
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.specialization ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.specialization && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.specialization}
                </p>
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-700"
              >
                License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.licenseNumber ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.licenseNumber && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.licenseNumber}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="yearsOfExperience"
                className="block text-sm font-medium text-gray-700"
              >
                Years of Experience
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.yearsOfExperience
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              />
              {errors.yearsOfExperience && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.yearsOfExperience}
                </p>
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
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.bio ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
              ></textarea>
              {errors.bio && (
                <p className="mt-2 text-sm text-red-600">{errors.bio}</p>
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
          Doctor Onboarding
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
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
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
