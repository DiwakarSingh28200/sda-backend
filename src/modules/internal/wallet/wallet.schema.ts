import { z } from "zod"

export const WalletTransactionFilterSchema = z.object({
  type: z.string().optional(),
  from: z.string().optional(), // ISO date
  to: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

export const DealerWithdrawalRequestSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  bank_account_id: z.string().uuid("Invalid bank account ID"),
})

export const ManualPaymentRequestSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  utr_number: z.string().min(5, "UTR number is required"),
  receipt_url: z.string().url("Valid receipt URL is required"),
  remarks: z.string().optional(),
})

export const ManualPaymentApprovalSchema = z.object({
  status: z.string().min(1, "Status is required"),
  remarks: z.string().optional(),
  verified_by: z.string().uuid("Invalid verified by ID"),
})

export const WalletConfigSchema = z.object({
  tds_percent: z.number().min(0).max(100),
  cashback_percent: z.number().min(0).max(100),
  credit_validity_days: z.number().int().min(1),
})

export const ApproveWithdrawalSchema = z.object({
  status: z.literal("paid"), // We only allow marking as "paid"
  utr_number: z.string().min(5, "UTR number is required"),
  payout_method: z.string(),
  payout_reference: z.string().optional(),
  razorpayx_payout_id: z.string().optional(),
  razorpayx_status: z.string().optional(),
  razorpayx_mode: z.string().optional(),
})
