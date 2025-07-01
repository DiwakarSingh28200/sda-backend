import express from "express"
import {
  generateDealerAgreementController,
  sendDealerAgreementEmailController,
} from "./agreement.controller"

const router = express.Router()

router.post("/generate/:dealerId", generateDealerAgreementController)
router.post("/send/:dealerId", sendDealerAgreementEmailController)

export default router
