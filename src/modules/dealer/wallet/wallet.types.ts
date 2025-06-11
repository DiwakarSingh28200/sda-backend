import { z } from "zod"
import {
  AddBankAccountSchema,
  DealerWithdrawalRequestSchema,
  ManualPaymentApprovalSchema,
  WalletPaymentInitiateSchema,
  WalletPaymentSuccessSchema,
  WalletTransactionFilterSchema,
} from "./wallet.schema"
import { Database } from "../../../types/supabase"
import { ManualPaymentRequestSchema } from "./wallet.schema"

export type Wallet = Database["public"]["Tables"]["wallets"]["Row"]
export type Transaction = Database["public"]["Tables"]["wallet_transactions"]["Row"]

export type ManualPaymentInsert =
  Database["public"]["Tables"]["wallet_manual_payment_requests"]["Insert"]
export type ManualPaymentRequestInput = z.infer<typeof ManualPaymentRequestSchema>

export type WalletTransactionFilterInput = z.infer<typeof WalletTransactionFilterSchema>
export type WithdrawalRequestInput = z.infer<typeof DealerWithdrawalRequestSchema>

export type ManualPaymentApprovalInput = z.infer<typeof ManualPaymentApprovalSchema>

// Wallet Withdrawal Options
export type WalletWithdrawalOptionsInsert =
  Database["public"]["Tables"]["wallet_withdrawal_options"]["Insert"]

export type WalletWithdrawalOptionsUpdate =
  Database["public"]["Tables"]["wallet_withdrawal_options"]["Update"]

export type WalletPaymentInitiateInput = z.infer<typeof WalletPaymentInitiateSchema>

export type WalletPaymentSuccessInput = z.infer<typeof WalletPaymentSuccessSchema>
