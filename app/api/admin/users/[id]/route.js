import { createServiceRoleClient } from "@/utils/supabase/serviceAccount";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const supabase = createServiceRoleClient();
  const { id } = params;

  try {
    const { data, error } = await supabase.auth.admin.deleteUser(id, true);

    console.log(error);

    console.log(data);

    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
