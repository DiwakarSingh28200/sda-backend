import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Extend Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string
      roles: string[]
      permissions: string[]
    }
  }
}

export const authenticateEmployee = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.access_token
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized: No token" })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      roles: string[]
      permissions: string[]
    }

    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" })
  }
}
