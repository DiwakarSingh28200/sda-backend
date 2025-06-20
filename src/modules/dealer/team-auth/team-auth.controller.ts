import { Request, Response } from "express"
import {
  loginDealerEmployeeService,
  getLoggedInDealerEmployeeService,
  logoutDealerEmployeeService,
  resetDealerEmployeePasswordService,
} from "./team-auth.service"

export const loginDealerEmployeeHandler = async (req: Request, res: Response) => {
  const result = await loginDealerEmployeeService(req.body)

  if (result.token) {
    return res
      .cookie("dealer_employee_token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        status: 200,
        success: true,
        message: "Login successful.",
        data: result.data,
      })
  }

  return res.status(result.status).json(result)
}

export const getLoggedInDealerEmployeeHandler = async (req: Request, res: Response) => {
  const result = await getLoggedInDealerEmployeeService(req.dealerEmployee!.id)
  return res.status(result.status).json(result)
}

export const logoutDealerEmployeeHandler = async (_req: Request, res: Response) => {
  const cookieName = "dealer_employee_token"
  const cookieOptions = {
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  }
  res.clearCookie(cookieName, cookieOptions)
  return res.status(200).json({
    status: 200,
    success: true,
    message: "Logout successful",
  })
}

export const resetDealerEmployeePasswordHandler = async (req: Request, res: Response) => {
  const employee_id = req.dealerEmployee!.id
  const dealerId = req.dealerEmployee!.dealer_id
  const { new_password } = req.body

  if (!dealerId || !employee_id || !new_password) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required",
    })
  }
  const result = await resetDealerEmployeePasswordService(dealerId, employee_id, new_password)
  if (!result.success) {
    return res.status(result.status).json(result)
  }
  // clear the dealer employee token
  res.clearCookie("dealer_employee_token", {
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  })
  return res.status(result.status).json(result)
}
