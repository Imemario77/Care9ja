import { createServiceRoleClient } from "@/utils/supabase/serviceAccount";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const supabase = createServiceRoleClient();
  const { id } = params;

  try {
    // Update user_type to 'BANNED'

    const { data: user, error } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: "8544h",
    });

    console.log(error);

    const { error: updateError } = await supabase
      .from("users")
      .update({ user_type: "BANNED" })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "User banned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error banning user:", error);
    return NextResponse.json({ error: "Failed to ban user" }, { status: 500 });
  }
}
