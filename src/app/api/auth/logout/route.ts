import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.refreshToken) {
      return Response.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Check token exists
    const {
      data: checkToken,
      error: checkTokenError,
    } = await supabase
      .from("refresh_tokens")
      .select("id, user_id, expires_at")
      .eq("token", body.refreshToken)
      .maybeSingle();

    if (checkTokenError) {
      console.log("checkTokenError", checkTokenError);

      return Response.json(
        { message: "Failed to validate refresh token" },
        { status: 500 }
      );
    }

    if (!checkToken) {
      return Response.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Delete refresh token
    const { error: deleteError } = await supabase
      .from("refresh_tokens")
      .delete()
      .eq("id", checkToken.id);

    if (deleteError) {
      console.log("deleteError", deleteError);

      return Response.json(
        { message: "Failed to logout" },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Logout Successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Logout error", error);

    return Response.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}