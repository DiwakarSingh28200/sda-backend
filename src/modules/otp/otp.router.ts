import { Router } from "express"
import {
  sendEmailOTPController,
  sendEmailUsingZohoAPIController,
  sendOTPController,
  verifyOTPController,
} from "./opt.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.post("/send", asyncHandler(sendOTPController))
router.post("/verify", asyncHandler(verifyOTPController))
router.post("/send-email", asyncHandler(sendEmailOTPController))
router.post("/send-email-using-zoho", asyncHandler(sendEmailUsingZohoAPIController))

export default router
