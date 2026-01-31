import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export function generateAccessToken(payload: { userId: number; email: string }) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: { userId: number }) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}
