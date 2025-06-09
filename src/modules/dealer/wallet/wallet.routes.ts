import { Router } from "express"
import {
  getTransactionHistory,
  getWalletBalance,
  getWithdrawalHistoryHandler,
  createWithdrawalRequestHandler,
  createBankAccountHandler,
  listBankAccounts,
  deleteBankAccount,
  setDefaultBankAccount,
  updateBankAccountHandler,
} from "./wallet.controller"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"

const router = Router()

// GET /dealer/wallet → Get wallet balance
router.get("/", authenticateDealer, getWalletBalance)
router.get("/transactions", authenticateDealer, getTransactionHistory)
router.get("/withdrawals", authenticateDealer, getWithdrawalHistoryHandler)
router.post("/withdrawals", authenticateDealer, createWithdrawalRequestHandler)
// router.get("/manual-payment", authenticateDealer, )

// POST /dealer/wallet/bank-account → Create bank account
router.post("/bank-account", authenticateDealer, createBankAccountHandler)
router.put("/bank-account/:id", authenticateDealer, updateBankAccountHandler)
router.get("/bank-accounts", authenticateDealer, listBankAccounts)
// router.put("/bank-accounts/:id", authenticateDealer, updateBankAccountHandler)
router.delete("/bank-accounts/:id", authenticateDealer, deleteBankAccount)
router.put("/bank-accounts/:id/default", authenticateDealer, setDefaultBankAccount)

export default router
