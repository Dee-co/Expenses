import { generateAccessToken } from "@/lib/jwt";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";
export async function POST(request: Request) {
  const body = await request.json();
  if (!body.refreshToken) {
    return Response.json({ message: "Invalid Request" }, { status: 500 });
  }
  try {
    const verifyToken = jwt.verify(
      body.refreshToken,
      process.env.NEXT_PUBLIC_JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;
    const userId = verifyToken?.userId;
    if (!userId) {
      return Response.json({ error: "invalid Refresh token" }, { status: 401 });
    }
    const { data: storedToken, error } = await supabase
      .from("refresh_tokens")
      .select("id,user_id, expires_at")
      .eq("token", body.refreshToken)
      .single();
    if (error || !storedToken) {
      return Response.json(
        { message: "Refresh Token not found" },
        { status: 401 }
      );
    }
    if (storedToken.user_id !== userId) {
      return Response.json({ error: "Invalid refresh token" }, { status: 401 });
    }
    if (new Date(storedToken.expires_at) < new Date()) {
      return Response.json({ error: "Refresh token expired" }, { status: 401 });
    }
    const accessToken = generateAccessToken(userId);
    return Response.json({
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return Response.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
