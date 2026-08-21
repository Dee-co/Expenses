import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const { data: user, error } = await supabase
    .from("users")
    .select("id,name,email,password_hash")
    .eq("email", body.email)
    .single();
  if (error || !user) {
    return Response.json(
      { error: "Invalid email & password" },
      { status: 401 }
    );
  }
  const isPasswordValid = await bcrypt.compare(
    body.password,
    user.password_hash
  );
  if (!isPasswordValid) {
    return Response.json({ error: "Invalid Password" }, { status: 401 });
  }
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  const {error:refreshTokenError} = await supabase.from("refresh_tokens").insert({
    user_id:user.id,
    token:refreshToken,
    expires_at:new Date(Date.now()+7*24*60*60*1000).toISOString()
  })
  if(refreshTokenError){
    return Response.json({error:refreshTokenError.message},{status:500})
  }
  return Response.json({
    message: "Login Successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken
  });
}
