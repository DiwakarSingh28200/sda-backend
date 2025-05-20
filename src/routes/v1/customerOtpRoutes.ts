import { Router } from "express"
import { sendOtpHandler, verifyOtpHandler } from "../../controllers/customerOtpController"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = Router()

// POST /api/customers/send-otp → triggers Twilio OTP SMS
router.post("/send-otp", asyncHandler(sendOtpHandler))

// POST /api/customers/verify-otp → verifies code via Twilio
router.post("/verify-otp", asyncHandler(verifyOtpHandler))

export default router
