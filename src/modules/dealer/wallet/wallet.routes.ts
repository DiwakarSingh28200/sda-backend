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
  initiateWalletPayment,
  markWalletPaymentSuccess,
  submitManualPayment,
} from "./wallet.controller"
import {
  authenticateDealer,
  authenticateDealerEmployee,
  authenticateDealerOrEmployee,
} from "../../../middleware/authMiddleware"

const router = Router()

// GET /dealer/wallet → Get wallet balance
// I want bother authecatedDealer and dealerEmployee to access this route
router.get("/", authenticateDealerOrEmployee, getWalletBalance)
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

// Add money on wallet
// POST /dealer/wallet/payment → Initiate wallet payment
router.post("/payment-initiate", authenticateDealer, initiateWalletPayment)
router.post("/payment-success", authenticateDealer, markWalletPaymentSuccess)

// Manual Payment
router.post("/manual-payment", authenticateDealer, submitManualPayment)

export default router
