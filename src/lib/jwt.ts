import jwt from "jsonwebtoken";
export function generateAccessToken(userId: string) {
  return jwt.sign(
    {
      userId,
    },
    process.env.NEXT_PUBLIC_JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );
}
export function generateRefreshToken(userId: string) {
  return jwt.sign(
    {
      userId,
    },
    process.env.NEXT_PUBLIC_JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
}
