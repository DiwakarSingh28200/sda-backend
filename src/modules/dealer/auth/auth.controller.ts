import { Request, Response } from "express"
import { loginDealerService, logoutDealerService, getLoggedInDealerService } from "./auth.service"

export const loginDealerHandler = async (req: Request, res: Response) => {
  const result = await loginDealerService(req.body)
  if (result.token) {
    return res
      .cookie("dealer_token", result.token, {
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

export const getLoggedInDealerHandler = async (req: Request, res: Response) => {
  const result = await getLoggedInDealerService(req.dealer!.id)
  return res.status(result.status).json(result)
}

export const logoutDealerHandler = async (_req: Request, res: Response) => {
  const cookieName = "dealer_token"
  const cookieOptions = {
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  }
  res.clearCookie(cookieName, cookieOptions)
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  })
}
