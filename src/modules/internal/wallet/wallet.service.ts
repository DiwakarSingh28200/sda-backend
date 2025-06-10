import { Database } from "../../../types/supabase"
import { db } from "../../../config/db"
import {
  ApproveWithdrawalInput,
  ManualPaymentApprovalInput,
  WalletConfigInput,
  WalletConfigInsert,
} from "./wallet.types"

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
  // 1. Fetch the withdrawal record
  const { data: withdrawal, error: fetchError } = await db
    .from("wallet_withdrawals")
    .select("*")
    .eq("id", withdrawal_id)
    .single()

  if (fetchError || !withdrawal) throw new Error("Withdrawal not found")

  const dealer_id = withdrawal.dealer_id
  const amount = withdrawal.amount

  // 2. Update withdrawal record
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", withdrawal_id)
    .select("*")
    .single()

  if (updateError) throw new Error("Failed to update withdrawal")

  // 3. Deduct from wallet
  const { error: balanceError } = await db
    .from("wallets")
    .update({ cash_balance: amount })
    .eq("dealer_id", dealer_id!)
    .eq("is_active", true)
    .eq("is_deleted", false)
    .eq("is_approved", true) // TODO: Check if this is correct

  if (balanceError) throw new Error("Failed to deduct from wallet balance")

  // 4. Create wallet transaction
  const { error: txnError } = await db.from("wallet_transactions").insert({
    dealer_id: dealer_id,
    amount: -amount,
    type: "withdrawal",
    source: payload.payout_method,
    reference_type: "wallet_withdrawal",
    reference_id: withdrawal_id,
    note: "Withdrawal marked as paid",
  })

  if (txnError) throw new Error("Failed to create wallet transaction")

  return updated
}
