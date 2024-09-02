import DoctorsList from "@/components/DoctorsList";
import { createClient } from "@/utils/supabase/server";

export default async function DoctorsListPage() {
  const supabse = createClient();
  const { data, error } = await supabse.from("doctorprofiles").select(`
      years_of_experience, id, specialization,
      user:user_id (
        full_name, profile_picture_url
      )
    `);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Find a Doctor</h1>
      <DoctorsList doctorList={data} />
    </div>
  );
}
