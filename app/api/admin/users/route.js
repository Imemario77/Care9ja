import { createServiceRoleClient } from "@/utils/supabase/serviceAccount";
import { NextResponse } from "next/server";

export async function GET(req) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const offset = (page - 1) * limit;

  try {
    let query = supabase.from("users").select(
      `
        id,
        full_name,
        phone_number,
        user_type,
        created_at,
        last_active,
        gender
      `,
      { count: "exact" }
    );

    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    const {
      data: users,
      count,
      error,
    } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json(
      {
        users,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
