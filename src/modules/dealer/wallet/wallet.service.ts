import { Database } from "../../../types/supabase"
import { db } from "../../../config/db"
import {
  ManualPaymentRequestInput,
  WalletPaymentInitiateInput,
  WalletWithdrawalOptionsInsert,
  WalletWithdrawalOptionsUpdate,
  WithdrawalRequestInput,
  WalletPaymentSuccessInput,
} from "./wallet.types"
import crypto from "crypto"
import { razorpay } from "../../../config/razorpay"

export const getWalletByDealerId = async (dealer_id: string) => {
  const { data, error } = await db
    .from("wallets")
    .select("*, dealer:dealer_id(dealership_name, dealer_id)")
    .eq("dealer_id", dealer_id)
    .single()

  if (error) {
    return null
  }

  // remove dealer from the data
  const { dealer, ...rest } = data
  return {
    ...rest,
    dealer_name: dealer?.dealership_name,
  }
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

export const insertManualPaymentRequest = async (
  dealer_id: string,
  payload: ManualPaymentRequestInput
) => {
  const { data, error } = await db
    .from("wallet_manual_payment_requests")
    .insert({
      dealer_id,
      amount: payload.amount,
      utr_number: payload.utr_number,
      receipt_url: payload.receipt_url,
      remarks: payload.remarks,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  // Add intry inside the wallet transactions table
  const { error: txnError } = await db.from("wallet_transactions").insert({
    dealer_id,
    amount: payload.amount,
    type: "recharge",
    source: "manual",
    reference_type: "wallet_manual_payment_request",
    reference_id: data?.id,
    note: "Manual Payment",
  })

  if (txnError) {
    return {
      success: false,
      message: "Failed to insert manual payment request " + txnError.message,
    }
  }

  return {
    success: true,
    data,
  }
}

export const createBankAccount = async (
  dealer_id: string,
  payload: WalletWithdrawalOptionsInsert
) => {
  const { data, error } = await db
    .from("wallet_withdrawal_options")
    .insert({
      dealer_id,
      account_holder_name: payload.account_holder_name,
      account_number: payload.account_number,
      ifsc_code: payload.ifsc_code,
      is_default: false,
    })
    .select("*")
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to add bank account",
    }
  }
  return {
    success: true,
    data,
  }
}

export const getBankAccounts = async (dealer_id: string) => {
  const { data, error } = await db
    .from("wallet_withdrawal_options")
    .select("*")
    .eq("dealer_id", dealer_id)
    .order("created_at", { ascending: false })

  if (error) {
    return {
      success: false,
      message: "Failed to fetch bank accounts",
    }
  }
  return {
    success: true,
    data,
  }
}

export const removeBankAccount = async (dealer_id: string, id: string) => {
  const { error } = await db
    .from("wallet_withdrawal_options")
    .delete()
    .eq("dealer_id", dealer_id)
    .eq("id", id)

  if (error) {
    return {
      success: false,
      message: "Failed to remove bank account",
    }
  }
  return {
    success: true,
    message: "Bank account removed successfully",
  }
}

export const markBankAccountAsDefault = async (dealer_id: string, account_id: string) => {
  // Step 1: Set all to false
  const { error: clearError } = await db
    .from("wallet_withdrawal_options")
    .update({ is_default: false })
    .eq("dealer_id", dealer_id)

  if (clearError) {
    return {
      success: false,
      message: "Failed to clear previous default",
    }
  }

  // Step 2: Set selected one as default
  const { data, error } = await db
    .from("wallet_withdrawal_options")
    .update({ is_default: true })
    .eq("id", account_id)
    .eq("dealer_id", dealer_id)
    .select("*")
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to set default bank account",
    }
  }

  return {
    success: true,
    data,
  }
}

export const updateBankAccount = async (
  dealer_id: string,
  id: string,
  payload: WalletWithdrawalOptionsUpdate
) => {
  const { data, error } = await db
    .from("wallet_withdrawal_options")
    .update(payload)
    .eq("id", id)
    .eq("dealer_id", dealer_id)
    .select("*")
    .single()

  if (error) {
    return {
      success: false,
      message: "Failed to update bank account",
    }
  }
  return {
    success: true,
    data,
  }
}

export const initiateWalletPaymentService = async (
  dealer_id: string,
  payload: WalletPaymentInitiateInput
) => {
  const { amount, discount = 0 } = payload
  const net_amount = amount - discount

  const options = {
    amount: net_amount * 100,
    currency: "INR",
    receipt: "receipt_order_" + Date.now(),
  }

  const order = await razorpay.orders.create(options)

  if (!order) {
    return {
      success: false,
      message: "Failed to create order",
    }
  }

  const { data, error: insertError } = await db
    .from("wallet_payments")
    .insert({
      dealer_id,
      payment_mode: "razorpay",
      payment_status: "created",
      razorpay_order_id: order.id,
      gross_amount: amount,
      discount,
      net_amount,
    })
    .select("id")
    .single()

  if (insertError) {
    return {
      success: false,
      message: "Failed to create wallet payment",
    }
  }

  return {
    success: true,
    data: order,
  }
}

export const handleWalletPaymentSuccess = async (
  dealer_id: string,
  payload: WalletPaymentSuccessInput
) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload

  // Step 1: Verify Razorpay signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex")

  if (generatedSignature !== razorpay_signature) {
    return {
      success: false,
      message: "Invalid Razorpay signature",
    }
  }

  // Step 2: Fetch the payment record
  const { data: payment, error: fetchError } = await db
    .from("wallet_payments")
    .select("*")
    .eq("razorpay_order_id", razorpay_order_id)
    .eq("dealer_id", dealer_id)
    .single()

  if (fetchError || !payment) {
    return {
      success: false,
      message: "Payment not found",
    }
  }

  if (payment.payment_status === "captured") {
    return {
      success: false,
      message: "Payment already captured",
    }
  }

  const net_amount = payment.net_amount

  // Step 3: Update wallet_payments
  const { error: updateError } = await db
    .from("wallet_payments")
    .update({
      payment_status: "captured",
      razorpay_payment_id,
      razorpay_signature,
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", payment.id)

  if (updateError) {
    return {
      success: false,
      message: "Failed to update payment",
    }
  }

  // get wallet id from dealer_id
  const { data: wallet, error: walletError } = await db
    .from("wallets")
    .select("id")
    .eq("dealer_id", dealer_id)
    .single()

  if (walletError) {
    return {
      success: false,
      message: "Failed to get wallet id",
    }
  }

  // Step 4: Insert into wallet_transactions
  const { error: txnError } = await db.from("wallet_transactions").insert({
    dealer_id,
    wallet_id: wallet?.id,
    amount: net_amount ?? 0,
    type: "recharge",
    source: "razorpay",
    reference_type: "wallet_payment",
    reference_id: payment.id,
    note: "Recharge via Razorpay",
  })

  if (txnError) {
    return {
      success: false,
      message: "Failed to log wallet transaction",
    }
  }

  // Step 5: Update wallet balance
  const { error: balanceError } = await db.rpc("update_wallet_balance_after_recharge", {
    dealer_id_input: dealer_id,
    addition_amount: net_amount ?? 0,
  })

  if (balanceError) throw new Error("Failed to update wallet balance")

  return {
    success: true,
    data: {
      razorpay_order_id,
      razorpay_payment_id,
      credited_amount: net_amount,
    },
  }
}
