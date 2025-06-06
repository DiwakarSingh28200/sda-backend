import { Router } from "express"
import {
  getTransactionHistory,
  getWalletBalance,
  getWithdrawalHistoryHandler,
} from "./wallet.controller"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"

const router = Router()

// GET /dealer/wallet → Get wallet balance
router.get("/wallet", authenticateDealer, getWalletBalance)
router.get("/transactions", authenticateDealer, getTransactionHistory)
router.get("/withdrawals", authenticateDealer, getWithdrawalHistoryHandler)
export default router
