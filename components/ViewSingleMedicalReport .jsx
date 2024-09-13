"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  FileText,
  User,
  Calendar,
  Clipboard,
  Stethoscope,
  Pill,
  AlertCircle,
  Edit,
  Save,
  X,
} from "lucide-react";
import { parseTimestamp } from "@/utils/functions";

const ViewSingleMedicalReport = ({ reportData, isDoc }) => {
  const [report, setReport] = useState(reportData || {});
  const [editedReport, setEditedReport] = useState(reportData || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("medical_reports")
      .update({
        title: editedReport.title,
        diagnosis: editedReport.diagnosis,
        treatment_plan: editedReport.treatment_plan,
        notes: editedReport.notes,
        status: editedReport.status,
      })
      .eq("id", reportData.id);

    if (error) {
      setError("Failed to update the medical report");
      setLoading(false);
    } else {
      setReport(editedReport);
      setIsEditing(false);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!report) return <div className="text-center py-10">No report found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Medical Report: {report.title}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Report Details
                  </h3>
                  {isDoc && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </button>
                  )}
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Report Title
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {isEditing ? (
                          <input
                            type="text"
                            name="title"
                            value={editedReport.title}
                            onChange={handleInputChange}
                            className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm p-3 sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          report.title
                        )}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Patient Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {report.patient.full_name}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Doctor Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {report.doctor.full_name}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Created At
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {`${parseTimestamp(report.created_at).date} ${
                          parseTimestamp(report.created_at).time
                        }`}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Stethoscope className="mr-2 h-5 w-5" />
                        Diagnosis
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {isEditing ? (
                          <textarea
                            name="diagnosis"
                            rows={3}
                            value={editedReport.diagnosis}
                            onChange={handleInputChange}
                            className="mt-1 focus:ring-sky-500 focus:border-sky-500 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          report.diagnosis
                        )}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Pill className="mr-2 h-5 w-5" />
                        Treatment Plan
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {isEditing ? (
                          <textarea
                            name="treatment_plan"
                            rows={3}
                            value={editedReport.treatment_plan}
                            onChange={handleInputChange}
                            className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full  p-3 shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          report.treatment_plan
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Clipboard className="mr-2 h-5 w-5" />
                        Notes
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {isEditing ? (
                          <textarea
                            name="notes"
                            rows={3}
                            value={editedReport.notes}
                            onChange={handleInputChange}
                            className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full  p-3 shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          report.notes
                        )}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Status
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {isEditing ? (
                          <select
                            name="status"
                            value={editedReport.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 p-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              report.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : report.status === "Reviewed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {report.status}
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setEditedReport(report);
                        setIsEditing(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      router.push(
                        "/medical-reports/view?id=" + report.patient.id
                      )
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Back to Reports
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewSingleMedicalReport;
