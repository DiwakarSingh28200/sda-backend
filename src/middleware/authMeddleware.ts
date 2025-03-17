import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../types/apiResponse";

// ✅ Extend Express Request Type to Fix TypeScript Error
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; roles: string[]; permissions: string[] };
  }
}

export const authenticateEmployee = async (req: Request, res: Response<ApiResponse<any>>, next: NextFunction) => {
  try {
    const token = req.cookies.access_token; // ✅ Read token from cookies

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; roles: string[]; permissions: string[] };

    req.user = decoded; // ✅ Attach user data to `req.user`
    return next(); // ✅ Ensure it correctly moves to the next function
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
  }
};
