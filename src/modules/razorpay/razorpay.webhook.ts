import { Request, Response } from "express"
import crypto from "crypto"

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

  const signature = req.headers["x-razorpay-signature"] as string
  const body = JSON.stringify(req.body)

  const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex")

  const isValid = signature === expectedSignature

  if (!isValid) {
    return res.status(400).json({ success: false, message: "Invalid signature" })
  }

  const event = req.body

  try {
    switch (event.event) {
      case "payout.processed":
        // TODO: Handle payout success (e.g. update withdrawal record)
        break
      case "payout.failed":
        // TODO: Handle failure
        break
      case "payout.reversed":
        // TODO: Optional: notify admins
        break
    }

    return res.status(200).json({ success: true, message: "Webhook received" })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Webhook handling failed" })
  }
}
