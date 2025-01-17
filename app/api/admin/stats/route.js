// pages/api/admin/stats.js
// import { createServiceRoleClient } from "@/utils/supabase/serviceAccount";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  const supabase = createClient();

  try {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    console.log(totalUsers);
    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: newUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Get total reports
    const { count: totalReports } = await supabase
      .from("medical_reports")
      .select("*", { count: "exact", head: true });

    // Get active users (users with activity in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: activeUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("last_active", thirtyDaysAgo.toISOString());

    return NextResponse.json(
      {
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        totalReports: totalReports || 0,
        activeUsers: activeUsers || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);

    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}

// // pages/api/admin/reports.js
// import { createServiceRoleClient } from "@/utils/supabase/serviceAccount";

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const supabase = createServiceRoleClient();

//   try {
//     const { data: reports, error } = await supabase
//       .from('medical_reports')
//       .select(`
//         id,
//         title,
//         diagnosis,
//         status,
//         created_at,
//         patient_id (id, full_name),
//         doctor_id (id, full_name)
//       `)
//       .order('created_at', { ascending: false })
//       .limit(10);

//     if (error) throw error;

//     return res.status(200).json(reports);
//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     return res.status(500).json({ error: 'Failed to fetch reports' });
//   }
// }
