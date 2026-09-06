import jwt from "jsonwebtoken"
interface AccessTokenPayload {
  userId: string;
  iat: number;
  exp: number;
}
export function authenticateRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    throw new Error("Invalid authorization header");
  }
 
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXT_JWT_ACCESS_SECRET!
    ) as AccessTokenPayload;
    return {
      userId: decoded.userId,
    };
  } catch (error) {
    console.log("JWT ERROR:", error);
    throw new Error("Invalid or expired access token");
  }
}