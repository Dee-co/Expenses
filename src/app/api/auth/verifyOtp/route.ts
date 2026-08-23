import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.email || !body.otp) {
    return Response.json({ error: "Email and OTP required" }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();
  const otp = body.otp.toString().trim();
  const { data: userDetails, error: userError } = await supabaseAdmin
    .from("users")
    .select("id,email,name")
    .eq("email", email)
    .single();
  if (userError || !userDetails) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }
  const { data: otpDetails, error: otpError } = await supabaseAdmin
    .from("password_reset_tokens")
    .select("id, user_id, otp, expires_at,reset_token")
    .eq("user_id", userDetails.id)
    .maybeSingle();
  if (otpError) {
    console.log("otpError:", otpError);
    return Response.json({ message: "Failed to verify OTP" }, { status: 500 });
  }

  if (!otpDetails) {
    return Response.json(
      { message: "OTP not found. Please resend OTP." },
      { status: 400 }
    );
  }
  const isExpired = new Date(otpDetails.expires_at).getTime() < Date.now();

  if (isExpired) {
    await supabaseAdmin
      .from("password_reset_tokens")
      .delete()
      .eq("id", otpDetails.id);

    return Response.json(
      { message: "OTP has expired. Please resend OTP." },
      { status: 400 }
    );
  }
  if (otpDetails.otp !== otp) {
    return Response.json({ message: "Invalid OTP" }, { status: 400 });
  }
  const resetTokenExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  ).toISOString();
  const { data: updatedToken, error: updateError } = await supabaseAdmin
    .from("password_reset_tokens")
    .update({
      verified: true,
      reset_token_expires_at: resetTokenExpiresAt,
    })
    .eq("id", otpDetails.id)
    .select("id,user_id,reset_token,reset_token_expires_at,verified")
    .single();

  if (updateError) {
    console.log("updateError:", updateError);

    return Response.json(
      {
        message: "Failed to verify OTP",
      },
      { status: 500 }
    );
  }
  return Response.json(
    {
      message: "OTP verified successfully",
      verified: true,
      resetToken: updatedToken.reset_token,
      expiresAt: updatedToken.reset_token_expires_at,
    },
    { status: 200 }
  );
}
