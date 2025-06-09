import { Router } from "express"
import {
  approveManualPayment,
  getAllManualPaymentRequestsHandler,
  getManualPaymentRequestByIdHandler,
  updateWalletConfigEntryHandler,
  createWalletConfigEntryHandler,
  getLatestWalletConfigEntryHandler,
} from "./wallet.controller"

const router = Router()

router.get("/manual-payments", getAllManualPaymentRequestsHandler)
router.put("/manual-payment/:id", approveManualPayment)
router.get("/manual-payment/:id", getManualPaymentRequestByIdHandler)

// Wallet Default Config
router.post("/config", createWalletConfigEntryHandler)
router.get("/config", getLatestWalletConfigEntryHandler)
router.put("/config/:id", updateWalletConfigEntryHandler)

export default router
