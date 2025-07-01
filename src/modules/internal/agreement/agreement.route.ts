import express from "express"
import { generateDealerAgreementController } from "./agreement.controller"

const router = express.Router()

router.get("/generate/:dealerId", generateDealerAgreementController)

export default router
