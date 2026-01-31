import { Request, Response } from "express";
import { registerUser } from "./auth.service";
import { loginUser } from "./auth.service";


export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await registerUser(email, password);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}