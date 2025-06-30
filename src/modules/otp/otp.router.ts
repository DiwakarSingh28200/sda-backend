import { Router } from "express"
import { sendEmailOTPController, sendOTPController, verifyOTPController } from "./opt.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.post("/send", asyncHandler(sendOTPController))
router.post("/verify", asyncHandler(verifyOTPController))
router.post("/send-email", asyncHandler(sendEmailOTPController))

export default router
