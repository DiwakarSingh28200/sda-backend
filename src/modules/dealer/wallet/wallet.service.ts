import { Database } from "../../../types/supabase"
import { db } from "../../../config/db"
import { WithdrawalRequestInput } from "./wallet.types"

export const getWalletByDealerId = async (dealer_id: string) => {
  const { data, error } = await db.from("wallets").select("*").eq("dealer_id", dealer_id).single()

  if (error) {
    return null
  }

  return data as Database["public"]["Tables"]["wallets"]["Row"]
}

export const getDealerWalletTransactions = async (
  dealer_id: string,
  filters: {
    type?: string
    from?: string
    to?: string
    search?: string
    limit: number
    offset: number
  }
) => {
  let query = db
    .from("wallet_transactions")
    .select("*", { count: "exact" })
    .eq("dealer_id", dealer_id)
    .order("created_at", { ascending: false })

  if (filters.type) {
    query = query.eq("type", filters.type)
  }

  if (filters.from) {
    query = query.gte("created_at", filters.from)
  }

  if (filters.to) {
    query = query.lte("created_at", filters.to)
  }

  if (filters.search) {
    query = query.ilike("id", `%${filters.search}%`)
  }

  const { data, count, error } = await query.range(
    filters.offset,
    filters.offset + filters.limit - 1
  )

  if (!data) {
    return null
  }

  const transactions = data.map((tx) => {
    const isCredit = tx.type === "recharge"
    const amountAbs = Math.abs(tx.amount || 0)

    return {
      transaction_id: tx.id,
      date: tx.created_at?.split("T")[0] ?? "",
      type: isCredit ? "Recharge" : "Withdrawal",
      description: isCredit ? "Wallet Topup" : "Bank Transfer",
      amount: amountAbs,
      display: `${isCredit ? "+" : "-"}₹${amountAbs.toLocaleString("en-IN")}`,
      status: "Completed",
    }
  })

  return {
    transactions,
    total_count: count || 0,
  }
}

export const getWithdrawalHistory = async (
  dealer_id: string,
  filters: { status?: string; from: number; limit: number }
) => {
  const to = filters.from + filters.limit - 1

  let query = db
    .from("wallet_withdrawals")
    .select("*, bank_account_id:wallet_withdrawal_options(*)", { count: "exact" })
    .eq("dealer_id", dealer_id)
    .order("created_at", { ascending: false })

  if (filters.status) {
    query = query.eq("status", filters.status)
  }

  const { data, count, error } = await query.range(filters.from, to)

  if (error) {
    return null
  }

  const withdrawals = (data || []).map((w) => ({
    id: w.id,
    amount: w.amount,
    status: w.status,
    payout_method: w.payout_method,
    requested_at: w.created_at,
    paid_at: w.updated_at ?? null,
    bank_info: {
      account_holder_name: w.bank_account_id?.account_holder_name,
      account_number: w.bank_account_id?.account_number,
      ifsc_code: w.bank_account_id?.ifsc_code,
    },
  }))

  return {
    withdrawals,
    total_count: count || 0,
    next_from: filters.from + withdrawals.length,
    has_more: filters.from + withdrawals.length < (count || 0),
  }
}

export const createWithdrawalRequest = async (
  dealer_id: string,
  payload: WithdrawalRequestInput
) => {
  const { data, error } = await db
    .from("wallet_withdrawals")
    .insert({
      dealer_id,
      amount: payload.amount,
      bank_account_id: payload.bank_account_id,
      status: "requested",
      payout_method: "manual",
    })
    .select()
    .single()

  console.log(data, error)

  if (error) {
    return {
      success: false,
      message: "Failed to create withdrawal request",
    }
  }

  return {
    success: true,
    data,
  }
}
