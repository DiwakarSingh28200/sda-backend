import { Request, Response, NextFunction } from "express"
import { ApiResponse } from "../types/apiResponse"

export const apiKeyMiddleware = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const rawKey = req.headers["x-api-key"]
    const apiKey = Array.isArray(rawKey) ? rawKey[0] : rawKey
    const validKey = process.env.RSA_API_KEY

    if (!apiKey || apiKey.trim() !== validKey) {
      res.status(401).json({ success: false, message: "Unauthorized: Invalid API key" })
      return
    }

    next()
  } catch (error) {
    console.error("API Key Middleware Error:", error)
    res.status(401).json({ success: false, message: "Unauthorized: Invalid API key" })
  }
}
