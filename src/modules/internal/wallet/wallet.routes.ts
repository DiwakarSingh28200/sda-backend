import { Router } from "express"
import {
  approveManualPayment,
  getAllManualPaymentRequestsHandler,
  getManualPaymentRequestByIdHandler,
  updateWalletConfigEntryHandler,
  createWalletConfigEntryHandler,
  getLatestWalletConfigEntryHandler,
  approveWithdrawal,
  processWithdrawalPayoutHandler,
  handleAdminWithdrawalsList,
} from "./wallet.controller"

const router = Router()

router.get("/manual-payments", getAllManualPaymentRequestsHandler)
router.put("/manual-payment/:id", approveManualPayment)
router.get("/manual-payment/:id", getManualPaymentRequestByIdHandler)

// Wallet Default Config
router.post("/config", createWalletConfigEntryHandler)
router.get("/config", getLatestWalletConfigEntryHandler)
router.put("/config/:id", updateWalletConfigEntryHandler)

// Withdrawals
router.get("/withdrawals", handleAdminWithdrawalsList)
router.patch("/withdrawals/:id", approveWithdrawal)
router.post("/withdrawals/:id/process", processWithdrawalPayoutHandler)

export default router
