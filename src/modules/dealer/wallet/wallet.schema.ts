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
