import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { generateAccessToken, generateRefreshToken } from "./auth.utils";
const SALT_ROUNDS = 10;

export async function registerUser(email: string, password: string) {
  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // 4. Never return password
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}


export async function loginUser(email: string, password: string) {
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 2. Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // 3. Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // (Optional but recommended) store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { /* you can store refreshToken here if you add the field */ },
  });

  // 4. Return tokens (never return password)
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}