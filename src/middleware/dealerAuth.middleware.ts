import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

declare module "express-serve-static-core" {
  interface Request {
    dealer?: {
      id: string
      dealer_id: string
      is_sub_dealer: boolean
    }
  }
}

export const authenticateDealer = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.access_token
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized: No token" })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      dealer_id: string
      is_sub_dealer: boolean
    }

    req.dealer = decoded
    next()
  } catch {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token" })
  }
}
