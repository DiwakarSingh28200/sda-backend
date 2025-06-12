import { Router } from "express"
import { sendOTPController, verifyOTPController } from "./opt.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.post("/send", asyncHandler(sendOTPController))
router.post("/verify", asyncHandler(verifyOTPController))

export default router
