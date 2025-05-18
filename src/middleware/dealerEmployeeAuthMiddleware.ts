import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

declare module "express-serve-static-core" {
  interface Request {
    dealerEmployee?: {
      id: string
      dealer_id: string
    }
  }
}

export const authenticateDealerEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.dealer_employee_token
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized: No token" })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      dealer_id: string
    }

    req.dealerEmployee = decoded
    next()
  } catch {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token" })
  }
}
