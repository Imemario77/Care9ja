// "use client";

// import React, { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";

// export default function AdminAppointmentRequests() {
//   const supabase = createClient();
//   const [appointments, setAppointments] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   const fetchAppointments = async () => {
//     const pageSize = 10; // Number of items per page
//     const { data, error, count } = await supabase
//       .from("appointment_requests")
//       .select("*, user:user_id(full_name)", { count: "exact" })
//       .order("requested_at", { ascending: false })
//       .range((page - 1) * pageSize, page * pageSize - 1);

//     console.log(data);
//     if (error) {
//       console.error("Error fetching appointments:", error);
//     } else {
//       setAppointments(data);
//       setTotalPages(Math.ceil(count / pageSize));
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [page]);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="py-10 px-5">
//         <header>
//           <h1 className="text-3xl font-bold leading-tight text-gray-900">
//             Appointment Requests
//           </h1>
//         </header>
//         <main>
//           <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//             <div className="px-4 py-8 sm:px-0">
//               <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           User
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           notes
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {appointments.map((appointment) => (
//                         <tr key={appointment.id}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {appointment.user.full_name}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {appointment.notes || "N/A"}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {appointment.status}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             Actions
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>

//                   <div className="flex justify-between mt-4">
//                     <button
//                       disabled={page === 1}
//                       onClick={() => setPage(page - 1)}
//                       className="text-sm font-medium text-blue-600 hover:text-blue-800"
//                     >
//                       Previous
//                     </button>
//                     <button
//                       disabled={page === totalPages}
//                       onClick={() => setPage(page + 1)}
//                       className="text-sm font-medium text-blue-600 hover:text-blue-800"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function AdminAppointmentRequests() {
  const supabase = createClient();
  const router = useRouter(); // Initialize the router
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAppointments = async () => {
    const pageSize = 10; // Number of items per page
    const { data, error, count } = await supabase
      .from("appointment_requests")
      .select("*, user:user_id(full_name)", { count: "exact" })
      .order("requested_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    console.log(data);
    if (error) {
      console.error("Error fetching appointments:", error);
    } else {
      setAppointments(data);
      setTotalPages(Math.ceil(count / pageSize));
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  // Handle cancel action
  const handleCancel = async (id) => {
    const { error } = await supabase
      .from("appointment_requests")
      .update({ status: "Cancelled" })
      .eq("id", id);

    if (error) {
      console.error("Error cancelling appointment:", error);
    } else {
      fetchAppointments(); // Refresh the list after cancelling
    }
  };

  // Handle accept action (redirect to booking page)
  const handleAccept = (id) => {
    router.push(`/admin/appointments/booking?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10 px-5">
        <header>
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Appointment Requests
          </h1>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {appointment.user.full_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {appointment.notes || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {appointment.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleCancel(appointment.id)}
                              className="text-sm font-medium text-red-600 hover:text-red-800 mr-4"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAccept(appointment.id)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              Accept
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between mt-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
