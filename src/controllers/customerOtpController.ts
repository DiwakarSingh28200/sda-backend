import twilio from "../config/twilioClient"
import { errorResponse, successResponse } from "../utils/apiResponse"
import { Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()

export const sendOtpHandler = async (req: Request, res: Response) => {
  console.log("req.body: ", req.body)
  const phone = req.body.phone as string
  console.log("phone: ", phone)
  if (!phone || phone.length !== 10) {
    return res.status(400).json(errorResponse("Invalid phone number"))
  }

  try {
    const result = await twilio.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      })

    if (result.status === "pending") {
      return res.json(successResponse("OTP sent successfully"))
    }

    throw new Error("Failed to send OTP")
  } catch (err: any) {
    return res.status(500).json(errorResponse("OTP sending failed", err.message))
  }
}

export const verifyOtpHandler = async (req: Request, res: Response) => {
  const { phone, otp } = req.body

  if (!phone || !otp) {
    return res.status(400).json(errorResponse("Missing phone or OTP"))
  }

  try {
    const result = await twilio.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      })

    if (result.status === "approved") {
      // Optional: fetch customer and return token
      return res.json(successResponse("OTP verified successfully"))
    }

    return res.status(400).json(errorResponse("OTP verification failed"))
  } catch (err: any) {
    return res.status(500).json(errorResponse("OTP verification failed", err.message))
  }
}
