import { z } from "zod"

export const WalletTransactionFilterSchema = z.object({
  type: z.string().optional(),
  from: z.string().optional(), // ISO date
  to: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})
