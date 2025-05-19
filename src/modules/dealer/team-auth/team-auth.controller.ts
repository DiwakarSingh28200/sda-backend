import { Request, Response } from "express"
import {
  loginDealerEmployeeService,
  getLoggedInDealerEmployeeService,
  logoutDealerEmployeeService,
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
  return res.clearCookie("dealer_employee_token").json({
    status: 200,
    success: true,
    message: "Logout successful",
  })
}
