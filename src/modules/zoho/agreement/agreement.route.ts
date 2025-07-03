import express from "express"
import {
  generateDealerAgreementController,
  sendDealerAgreementEmailController,
  downloadDealerAgreementController,
  generateVendorAgreementController,
} from "./agreement.controller"

const router = express.Router()

router.get("/generate/download/:dealerId", downloadDealerAgreementController)
router.post("/generate/:dealerId", generateDealerAgreementController)
router.post("/send/:dealerId", sendDealerAgreementEmailController)
router.get("/vendor/generate/:vendorId", generateVendorAgreementController)

export default router
