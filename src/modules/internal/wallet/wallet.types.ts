import { z } from "zod"
import {
  DealerWithdrawalRequestSchema,
  ManualPaymentApprovalSchema,
  WalletConfigSchema,
  WalletTransactionFilterSchema,
} from "./wallet.schema"
import { Database } from "../../../types/supabase"
import { ApproveWithdrawalSchema, ManualPaymentRequestSchema } from "./wallet.schema"

export type Wallet = Database["public"]["Tables"]["wallets"]["Row"]
export type Transaction = Database["public"]["Tables"]["wallet_transactions"]["Row"]

export type ManualPaymentInsert =
  Database["public"]["Tables"]["wallet_manual_payment_requests"]["Insert"]
export type ManualPaymentRequestInput = z.infer<typeof ManualPaymentRequestSchema>

export type WalletTransactionFilterInput = z.infer<typeof WalletTransactionFilterSchema>
export type WithdrawalRequestInput = z.infer<typeof DealerWithdrawalRequestSchema>

export type ManualPaymentApprovalInput = z.infer<typeof ManualPaymentApprovalSchema>

export type WalletConfigInsert = Database["public"]["Tables"]["wallet_config_default"]["Insert"]
export type WalletConfigInput = z.infer<typeof WalletConfigSchema>
export type ApproveWithdrawalInput = z.infer<typeof ApproveWithdrawalSchema>
