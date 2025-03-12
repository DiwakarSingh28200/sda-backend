import { Request, Response } from "express";
import { db } from "../config/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string; 

// Employee Login (Using Supabase Auth)
export const loginEmployee = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log(email)

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  // Supabase Sign-In
  const { data, error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    res.status(401).json({ error: error.message });
    return;
  }

  // Generate a custom JWT for backend validation (optional)
  const token = jwt.sign({ userId: data.user.id, email: data.user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({ message: "Login successful", token, user: data.user });
};

// Employee Logout
export const logoutEmployee = async (req: Request, res: Response): Promise<void> => {
  await db.auth.signOut();
  res.status(200).json({ message: "Logged out successfully" });
};
