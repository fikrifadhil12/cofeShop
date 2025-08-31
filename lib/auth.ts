import jwt from "jsonwebtoken";

type JWTPayload = {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export function verifyAuthHeader(
  authHeader?: string | null
): JWTPayload | null {
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload;
    return payload;
  } catch {
    return null;
  }
}
