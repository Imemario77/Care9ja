import { createServiceRoleClient } from "@/utils/supabase/serviceAccount";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = createServiceRoleClient();
  let createdUser = null;

  try {
    const { email, password, fullName } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create the auth user using admin API
    const {
      error: createUserError,
      data: { user },
    } = await supabase.auth.admin.createUser({
      email,
      password,
      role: "service_role",
      email_confirm: true, // Automatically confirm the email
      user_metadata: {
        admin: true,
      },
    });

    if (createUserError) {
      return NextResponse.json(
        { error: createUserError.message },
        { status: createUserError.status || 500 }
      );
    }

    createdUser = user;

    // Try to create the user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: user.id,
        full_name: fullName || "System admin",
        user_type: "admin",
      })
      .select("id");

    // If profile creation fails, delete the auth user and throw error
    if (userError) {
      // Delete the auth user since profile creation failed
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user.id
      );

      if (deleteError) {
        console.error(
          "Failed to cleanup auth user after profile creation failed:",
          deleteError
        );
      }

      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    // If everything succeeded, return user data
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
    // If any unexpected error occurs and we created an auth user, clean it up
    if (createdUser) {
      try {
        await supabase.auth.admin.deleteUser(createdUser.id);
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup user after unexpected error:",
          cleanupError
        );
      }
    }

    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
