import { FileText, Eye, Plus } from "lucide-react";
import Link from "next/link";

const ViewMedicalReports = ({ reports }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Medical Reports
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {reports.length === 0 ? (
                    <li className="px-4 py-4 sm:px-6">
                      <p className="text-sm text-gray-500">No reports found.</p>
                    </li>
                  ) : (
                    reports.map((report) => (
                      <li key={report.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-sky-600 truncate">
                              {report.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {report.status}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                Patient: {report.patient.full_name}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Created:{" "}
                                {new Date(
                                  report.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Link
                              href={`/medical-report/${report.id}`}
                              className="text-sky-600 hover:text-sky-900"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewMedicalReports;
