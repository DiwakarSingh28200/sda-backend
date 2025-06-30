import { Request, Response } from "express"
import { sendEmailOTP, sendOTP, verifyOTP } from "./otp.service"

export const sendOTPController = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body
    if (!phone) {
      return res.status(200).json({
        success: false,
        message: "Phone is required",
      })
    }

    const result = await sendOTP(phone)
    if (result.success) {
      return res.status(200).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const verifyOTPController = async (req: Request, res: Response) => {
  const { phone, otp } = req.body

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone and OTP are required",
    })
  }

  const result = await verifyOTP(phone, otp)
  if (result?.success) {
    return res.status(200).json({
      success: true,
      message: result?.message,
    })
  }
  return res.status(400).json({
    success: false,
    message: result?.message,
  })
}
export const sendEmailOTPController = async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    })
  }
  const result = await sendEmailOTP(email)
  if (result.success) {
    return res.status(200).json(result)
  }
  return res.status(400).json({
    success: false,
    message: result?.message,
  })
}
