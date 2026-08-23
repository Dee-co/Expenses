import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.newPassword || !body.reset_token) {
      return Response.json(
        {
          message: "Password and reset token are required",
        },
        { status: 400 }
      );
    }
    const resetToken = body.reset_token.trim();
    const newPassword = body.newPassword.trim();
    if (newPassword.length < 6) {
      return Response.json(
        {
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }
    const { data: tokenDetails, error: tokenError } =
      await supabaseAdmin
        .from("password_reset_tokens")
        .select(
          "id,user_id,reset_token,reset_token_expires_at,verified"
        )
        .eq("reset_token", resetToken)
        .maybeSingle();

    if (tokenError) {
      console.log("tokenError:", tokenError);

      return Response.json(
        {
          message: "Failed to validate reset token",
        },
        { status: 500 }
      );
    }

    if (!tokenDetails) {
      return Response.json(
        {
          message: "Invalid reset token",
        },
        { status: 400 }
      );
    }
    if (!tokenDetails.verified) {
      return Response.json(
        {
          message: "Please verify OTP first",
        },
        { status: 400 }
      );
    }
    const isExpired =
      new Date(
        tokenDetails.reset_token_expires_at
      ).getTime() < Date.now();

    if (isExpired) {
      await supabaseAdmin
        .from("password_reset_tokens")
        .delete()
        .eq("id", tokenDetails.id);

      return Response.json(
        {
          message:
            "Reset token expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }
    const { data: user, error: userError } =
      await supabaseAdmin
        .from("users")
        .select("id,email,password_hash")
        .eq("id", tokenDetails.user_id)
        .maybeSingle();

    if (userError) {
      console.log("userError:", userError);

      return Response.json(
        {
          message: "Failed to find user",
        },
        { status: 500 }
      );
    }

    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    const { error: userUpdateError } =
      await supabaseAdmin
        .from("users")
        .update({
          password_hash: newPasswordHash,
        })
        .eq("id", user.id);

    if (userUpdateError) {
      console.log("userUpdateError:", userUpdateError);

      return Response.json(
        {
          message: "Failed to update password",
        },
        { status: 500 }
      );
    }

    // Delete reset token after successful reset
    const { error: deleteError } =
      await supabaseAdmin
        .from("password_reset_tokens")
        .delete()
        .eq("id", tokenDetails.id);

    if (deleteError) {
      console.log("deleteError:", deleteError);

      return Response.json(
        {
          message:
            "Password updated but failed to clear reset token",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("resetPassword error:", error);

    return Response.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}