import express from "express"
import { handleRazorpayWebhook } from "./razorpay.webhook"
import { asyncHandler } from "../../utils/asyncHandler"

const router = express.Router()

// Webhook route (Razorpay requires raw body)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(handleRazorpayWebhook)
)

export default router
