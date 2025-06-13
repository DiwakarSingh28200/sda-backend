import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Extend Express Request interface to include user, dealer, and dealerEmployee properties
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string
      roles: string[]
      permissions: string[]
    }
    dealer?: {
      id: string
      roles: string[]
      permissions: string[]
      dealer_id: string
      is_sub_dealer: boolean
    }
    dealerEmployee?: {
      id: string
      roles: string[]
      permissions: string[]
      dealer_id: string
    }
  }
}

// Define a common interface for the decoded token
interface DecodedToken {
  id: string
  roles: string[]
  permissions: string[]
}

// Define an enum for user types
enum UserType {
  Employee = "user",
  Dealer = "dealer",
  DealerEmployee = "dealerEmployee",
}

/**
 * Generic authentication middleware factory.
 *
 * @param userType - The type of user to authenticate.
 * @returns An Express middleware function.
 */
export const authenticate = (userType: UserType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Determine the token cookie name based on user type
      const tokenCookieName = {
        [UserType.Employee]: "access_token",
        [UserType.Dealer]: "dealer_token",
        [UserType.DealerEmployee]: "dealer_employee_token",
      }[userType]

      const token = req.cookies[tokenCookieName]

      // Check for token existence
      if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized: No token" })
        return
      }

      // Verify and decode the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

      // Attach the decoded user information to the request object
      req[userType] = decoded as any

      // Proceed to the next middleware or route handler
      next()
    } catch (error) {
      // Handle invalid tokens
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token" })
    }
  }
}

// Create specific authentication middlewares using the factory
export const authenticateEmployee = authenticate(UserType.Employee)
export const authenticateDealer = authenticate(UserType.Dealer)
export const authenticateDealerEmployee = authenticate(UserType.DealerEmployee)

export const authenticateDealerOrEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const dealerToken = req.cookies["dealer_token"]
    const dealerEmployeeToken = req.cookies["dealer_employee_token"]

    if (dealerToken) {
      const decoded = jwt.verify(dealerToken, process.env.JWT_SECRET!) as Request["dealer"]
      req.dealer = decoded
      return next()
    }

    if (dealerEmployeeToken) {
      const decoded = jwt.verify(
        dealerEmployeeToken,
        process.env.JWT_SECRET!
      ) as Request["dealerEmployee"]
      req.dealerEmployee = decoded
      return next()
    }

    res
      .status(401)
      .json({ success: false, message: "Unauthorized: No valid dealer or dealer employee token" })
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token" })
  }
}
