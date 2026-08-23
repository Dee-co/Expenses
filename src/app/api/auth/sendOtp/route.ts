import { sendOtpEmail } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from "crypto";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.email) {
      return Response.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }
    const email = body.email.trim().toLowerCase();
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      console.log("userError:", userError);

      return Response.json(
        {
          message: "Failed to find user",
        },
        {
          status: 500,
        }
      );
    }
    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    const { data: existingOtp, error: existingOtpError } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("id, otp, expires_at, reset_token, reset_token_expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existingOtpError) {
      console.log("existingOtpError:", existingOtpError);
      return Response.json(
        { message: "Failed to process OTP" },
        { status: 500 }
      );
    }
    if (
      existingOtp &&
      new Date(existingOtp.expires_at).getTime() > Date.now()
    ) {
      return Response.json(
        {
          message:
            "OTP is still valid. Please wait until it expires.",
        },
        { status: 400 }
      );
    }
    if (existingOtp) {
      const { error: deleteError } = await supabaseAdmin
        .from("password_reset_tokens")
        .delete()
        .eq("id", existingOtp.id);

      if (deleteError) {
        console.log("deleteError:", deleteError);

        return Response.json(
          { message: "Failed to generate new OTP" },
          { status: 500 }
        );
      }
    }
    if (existingOtpError) {
      console.log("existingOtpError:", existingOtpError);

      return Response.json(
        { message: "Failed to process OTP" },
        { status: 500 }
      );
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const resetToken = crypto.randomBytes(32).toString("hex");
    const reset_token_expires_at = new Date(Date.now() + 15 * 60 * 100);
    const { error: deleteError } = await supabaseAdmin
      .from("password_reset_tokens")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.log("deleteError:", deleteError);
      return Response.json(
        {
          message: "Failed to generate OTP",
        },
        {
          status: 500,
        }
      );
    }
    const { error: storeError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        otp,
        expires_at: expiresAt,
        verified: false,
        reset_token_expires_at,
        reset_token: resetToken,
      });

    if (storeError) {
      console.log("storeError:", storeError);

      return Response.json(
        {
          message: "Failed to generate OTP",
        },
        {
          status: 500,
        }
      );
    }
    await sendOtpEmail({
      email: user.email,
      otp,
      name: user.name,
    });
    return Response.json(
      {
        message: "OTP sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("forgotPassword error:", error);
    return Response.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
