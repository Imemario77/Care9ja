import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email,
      password,
      data: {
        admin: true,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    // If sign in successful, return user data
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
