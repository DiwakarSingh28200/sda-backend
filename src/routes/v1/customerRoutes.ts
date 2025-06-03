import { Router } from "express"
import {
  createCustomerHandler,
  getCustomerByPhoneNumberHandler,
} from "../../controllers/customerController"
import { asyncHandler } from "../../middleware/asyncHandler"
import { sendOtpHandler, verifyOtpHandler } from "../../controllers/customerOtpController"

const router = Router()

// POST /api/customers - create new customer onboarding record
router.post("/", asyncHandler(createCustomerHandler))

// POST /api/customers/send-otp → triggers Twilio OTP SMS
router.post("/send-otp", asyncHandler(sendOtpHandler))

// POST /api/customers/verify-otp → verifies code via Twilio
router.post("/verify-otp", asyncHandler(verifyOtpHandler))

// GET /api/customers/phone-number → get customer by phone number
router.get("/:phoneNumber", asyncHandler(getCustomerByPhoneNumberHandler))

export default router
