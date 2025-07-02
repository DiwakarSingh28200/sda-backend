import express from "express"
import {
  generateDealerAgreementController,
  sendDealerAgreementEmailController,
  downloadDealerAgreementController,
} from "./agreement.controller"

const router = express.Router()

router.get("/generate/download/:dealerId", downloadDealerAgreementController)
router.post("/generate/:dealerId", generateDealerAgreementController)
router.post("/send/:dealerId", sendDealerAgreementEmailController)

export default router
