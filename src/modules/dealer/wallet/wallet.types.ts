import { z } from "zod"
import { WalletTransactionFilterSchema } from "./wallet.schema"
import { Database } from "../../../types/supabase"

export type Wallet = Database["public"]["Tables"]["wallets"]["Row"]
export type Transaction = Database["public"]["Tables"]["wallet_transactions"]["Row"]

export type WalletTransactionFilterInput = z.infer<typeof WalletTransactionFilterSchema>
