import { Database } from "../../../types/supabase"
import { db } from "../../../config/db"
import { ManualPaymentApprovalInput, WalletConfigInput, WalletConfigInsert } from "./wallet.types"

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
