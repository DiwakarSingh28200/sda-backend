import { Request, Response } from "express"
import {
  loginEmployeeService,
  getAllEmployeesService,
  getLoggedInUserService,
  logoutEmployeeService,
} from "./auth.service"

export const loginEmployeeHandler = async (req: Request, res: Response) => {
  const result = await loginEmployeeService(req.body)

  if (result.status === 200) {
    return res
      .cookie("access_token", result.token, {
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

export const getAllEmployeesHandler = async (_req: Request, res: Response) => {
  const result = await getAllEmployeesService()
  return res.status(result.status).json(result)
}

export const getLoggedInUserHandler = async (req: Request, res: Response) => {
  const result = await getLoggedInUserService(req.user!.id)
  return res.status(result.status).json(result)
}

export const logoutEmployeeHandler = async (_req: Request, res: Response) => {
  const result = await logoutEmployeeService(res)
  return res.status(result.status).json(result)
}
