import { Database } from "../../../types/supabase"
import { db } from "../../../config/db"
import {
  ApproveWithdrawalInput,
  ManualPaymentApprovalInput,
  WalletConfigInput,
  WalletConfigInsert,
} from "./wallet.types"
import axios from "axios"
import { createRazorpayFundAccount } from "../../dealer/wallet/wallet.service"
import { getDealerWallet } from "../../../utils/wallet.utils"

const RAZORPAYX_BASE_URL = "https://api.razorpay.com/v1"
const RAZORPAYX_KEY_ID = process.env.RAZORPAYX_KEY_ID!
const RAZORPAYX_KEY_SECRET = process.env.RAZORPAYX_KEY_SECRET!

const razorpayAxios = axios.create({
  baseURL: RAZORPAYX_BASE_URL,
  auth: {
    username: RAZORPAYX_KEY_ID,
    password: RAZORPAYX_KEY_SECRET,
  },
})

export const updateManualPaymentStatus = async (
  id: string,
  payload: ManualPaymentApprovalInput
) => {
  const { data, error } = await db
    .from("wallet_manual_payment_requests")
    .update({
      status: payload.status,
      remarks: payload.remarks || null,
      verified_by: payload.verified_by,
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to update manual payment request",
    }
  }
  return {
    success: true,
    data,
  }
}

export const getAllManualPaymentRequests = async () => {
  const { data, error } = await db
    .from("wallet_manual_payment_requests")
    .select("*")
    .eq("status", "pending")

  if (error) {
    return {
      success: false,
      message: "Failed to get manual payment requests",
    }
  }
  return {
    success: true,
    data,
  }
}

export const getManualPaymentRequestById = async (id: string) => {
  const { data, error } = await db
    .from("wallet_manual_payment_requests")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to get manual payment request",
    }
  }
  return {
    success: true,
    data,
  }
}

export const createWalletConfigEntry = async (payload: WalletConfigInsert) => {
  const { data, error } = await db
    .from("wallet_config_default")
    .insert(payload)
    .select("*")
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to create wallet config",
    }
  }
  return {
    success: true,
    data,
  }
}

export const getLatestWalletConfigEntry = async () => {
  const { data, error } = await db
    .from("wallet_config_default")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to fetch wallet config",
    }
  }
  return {
    success: true,
    data,
  }
}

export const updateWalletConfigEntry = async (id: string, payload: WalletConfigInsert) => {
  const { data, error } = await db
    .from("wallet_config_default")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to update wallet config",
    }
  }
  return {
    success: true,
    data,
  }
}

export const handleWithdrawalApproval = async (
  withdrawal_id: string,
  payload: ApproveWithdrawalInput
) => {
  // 1. Fetch the withdrawal record first
  const { data: withdrawal, error: fetchError } = await db
    .from("wallet_withdrawals")
    .select("*")
    .eq("id", withdrawal_id)
    .single()

  if (fetchError || !withdrawal) {
    return {
      success: false,
      message: "Withdrawal not found",
    }
  }

  const dealer_id = withdrawal.dealer_id
  const amount = withdrawal.amount

  // 2. Update the withdrawal record
  const { data: updated, error: updateError } = await db
    .from("wallet_withdrawals")
    .update({
      status: "paid",
      utr_number: payload.utr_number,
      payout_method: payload.payout_method,
      payout_reference: payload.payout_reference,
      razorpayx_payout_id: payload.razorpayx_payout_id,
      razorpayx_status: payload.razorpayx_status,
      razorpayx_mode: payload.razorpayx_mode,
      bank_account_id: payload.bank_account_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", withdrawal_id)
    .select("*")
    .single()

  if (updateError) {
    return {
      success: false,
      message: "Failed to update withdrawal",
    }
  }

  // 3. Deduct the amount from wallet
  const { error: walletError } = await db.rpc("update_wallet_balance_after_withdrawal", {
    dealer_id_input: dealer_id!,
    deduction_amount: amount,
  })

  if (walletError) {
    return {
      success: false,
      message: "Failed to deduct from wallet balance",
    }
  }

  // 4. Create wallet transaction
  const { error: txnError } = await db.from("wallet_transactions").insert({
    dealer_id: dealer_id,
    amount: -amount,
    type: "withdrawal",
    source: payload.payout_method,
    reference_type: "wallet_withdrawal",
    reference_id: withdrawal_id,
    note: `Withdrawal paid via ${payload.payout_method}`,
  })

  if (txnError) {
    return {
      success: false,
      message: "Failed to create wallet transaction",
    }
  }

  return {
    success: true,
    data: updated,
  }
}

export const processWithdrawalPayout = async (withdrawal_id: string) => {
  // 1. Fetch withdrawal request
  const { data: withdrawal, error } = await db
    .from("wallet_withdrawals")
    .select("*")
    .eq("id", withdrawal_id)
    .eq("status", "requested")
    .single()

  if (error || !withdrawal) {
    return { success: false, message: "Withdrawal not found or already processed" }
  }

  const { dealer_id, amount, bank_account_id } = withdrawal

  // 2. Create or reuse RazorpayX fund account
  const fundAccountRes = await createRazorpayFundAccount({
    dealer_id: dealer_id!,
    withdrawal_option_id: bank_account_id!,
  })

  if (!fundAccountRes.success) {
    return { success: false, message: "Failed to create fund account" }
  }

  const fund_account_id = fundAccountRes.fund_account_id

  // 3. Initiate payout
  const payoutPayload = {
    account_number: "YOUR_RAZORPAYX_ACCOUNT_NO", // usually shared by Razorpay
    fund_account_id,
    amount: Math.floor(Number(amount) * 100), // Razorpay expects paise
    currency: "INR",
    mode: "IMPS",
    purpose: "payout",
    queue_if_low_balance: true,
    reference_id: withdrawal_id,
    narration: "SureDrive Dealer Withdrawal",
  }

  const payoutRes = await razorpayAxios.post("/payouts", payoutPayload)

  const { id: payout_id, status: razorpayx_status, utr, mode, reference_id } = payoutRes.data

  // 4. Update withdrawal status
  await db
    .from("wallet_withdrawals")
    .update({
      status: razorpayx_status === "processing" ? "processing" : "paid",
      razorpayx_payout_id: payout_id,
      razorpayx_status,
      razorpayx_mode: mode,
      utr_number: utr,
      payout_reference: reference_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", withdrawal_id)

  // 5. Fetch wallet
  const wallet = await getDealerWallet(dealer_id!)

  if (!wallet) {
    return { success: false, message: "Wallet not found" }
  }

  // 6. Update wallet balance
  await db
    .from("wallets")
    .update({
      cash_balance: wallet.cash_balance! - Number(amount),
      updated_at: new Date().toISOString(),
    })
    .eq("id", wallet.id)
    .eq("is_active", true)

  // 7. Log transaction (deduct from wallet)
  await db.from("wallet_transactions").insert({
    dealer_id,
    wallet_id: wallet.id,
    amount: Number(amount),
    type: "withdrawal",
    source: "razorpay",
    reference_type: "wallet_withdrawal",
    reference_id: withdrawal_id,
    note: `Withdrawal processed via RazorpayX`,
  })

  return {
    success: true,
    message: "Payout initiated",
    payout_id,
    razorpayx_status,
  }
}

export const getAllWithdrawalsForAdmin = async (filters: {
  status?: string
  dealer_id?: string
  from_date?: string
  to_date?: string
  page?: number
  limit?: number
}) => {
  const { status, dealer_id, from_date, to_date, page = 1, limit = 20 } = filters

  const offset = (page - 1) * limit

  // Start base query
  let query = db
    .from("wallet_withdrawals")
    .select(
      `
      *,
      wallet_withdrawal_options (
        account_holder_name,
        account_number,
        ifsc_code
      ),
      dealers (
        id,
        dealership_name
      )
    `,
      { count: "exact" } // for pagination if needed later
    )
    .order("created_at", { ascending: false })

  // Dynamically apply filters only if provided
  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (dealer_id) {
    query = query.eq("dealer_id", dealer_id)
  }

  if (from_date) {
    query = query.gte("created_at", from_date)
  }

  if (to_date) {
    query = query.lte("created_at", to_date)
  }

  // Only apply pagination if limit > 0
  if (limit > 0) {
    query = query.range(offset, offset + limit - 1)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, message: "Failed to fetch withdrawals", error }
  }

  return {
    success: true,
    data,
  }
}
