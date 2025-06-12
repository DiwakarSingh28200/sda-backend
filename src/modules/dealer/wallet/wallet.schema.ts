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

export const AddBankAccountSchema = z.object({
  account_holder_name: z.string().min(1, "Account holder name is required"),
  account_number: z.string().min(6, "Account number is required"),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
})

export const UpdateBankAccountSchema = AddBankAccountSchema

export const WalletPaymentInitiateSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  discount: z.number().min(0).optional(), // Optional if you want to support cashback/promo
})

export const WalletPaymentSuccessSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})
