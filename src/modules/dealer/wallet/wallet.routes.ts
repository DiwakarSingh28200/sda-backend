import { Router } from "express"
import {
  getTransactionHistory,
  getWalletBalance,
  getWithdrawalHistoryHandler,
  createWithdrawalRequestHandler,
} from "./wallet.controller"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"

const router = Router()

// GET /dealer/wallet → Get wallet balance
router.get("/", authenticateDealer, getWalletBalance)
router.get("/transactions", authenticateDealer, getTransactionHistory)
router.get("/withdrawals", authenticateDealer, getWithdrawalHistoryHandler)
router.post("/withdrawals", authenticateDealer, createWithdrawalRequestHandler)
export default router
