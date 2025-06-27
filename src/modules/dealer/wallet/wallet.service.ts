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
import axios from "axios"
import { RazorpayXFundAccountInput } from "./wallet.types"

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
      date: tx.created_at,
      type: tx.type,
      description: tx.note,
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
  // Step 1: Fetch wallet
  const { data: wallet, error: walletError } = await getDealerWallet(dealer_id)

  if (walletError || !wallet || !wallet.is_active) {
    return {
      success: false,
      message: "Wallet not found or inactive",
    }
  }

  // Step 2: Validate balance
  if (Number(payload.amount) > Number(wallet.cash_balance)) {
    return {
      success: false,
      message: "Insufficient wallet balance",
    }
  }
  // Step 3: Proceed to create withdrawal request

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
      deposit_date: payload.deposit_date,
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
      cancelled_cheque_file: payload.cancelled_cheque_file,
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

type DeductWalletForSaleInput = {
  dealerId: string
  planAmount: number
  saleId: string // rsa_plan_sales.id
  customerId: string
  planId: string
  paymentSource: "cash" | "credit"
}

export async function deductWalletForSale({
  dealerId,
  planAmount,
  saleId,
  customerId,
  planId,
  paymentSource,
}: DeductWalletForSaleInput) {
  console.log("Deducting wallet for sale", {
    dealerId,
    planAmount,
    saleId,
    customerId,
    planId,
    paymentSource,
  })
  // 1. Fetch wallet
  const { data: wallet, error: walletErr } = await db
    .from("wallets")
    .select("*")
    .eq("dealer_id", dealerId)
    .single()

  if (walletErr || !wallet)
    return {
      success: false,
      message: "Wallet not found",
    }

  // 2. Fetch config
  const { data: config, error: configErr } = await db
    .from("wallet_config")
    .select("*")
    .eq("wallet_id", wallet.id)
    .single()

  if (configErr || !config)
    return {
      success: false,
      message: "Wallet config not found",
    }

  // 3. Calculate shares
  const dealerShare = (planAmount * config.dealership_share) / 100
  const sdaShare = (planAmount * config.sda_share) / 100

  // 4. Calculate TDS (default 2%)
  const tdsPercent = 2
  const tdsAmount = (dealerShare * tdsPercent) / 100
  const netDealerCommission = dealerShare - tdsAmount
  const totalDeduction = sdaShare + tdsAmount

  // 5. Check and update wallet
  let updateData: Record<string, any> = { updated_at: new Date().toISOString() }

  if (paymentSource === "cash") {
    if (wallet.cash_balance && wallet.cash_balance < totalDeduction)
      return {
        success: false,
        message: "Insufficient cash balance",
      }
    updateData.cash_balance = wallet.cash_balance! - totalDeduction
  } else {
    const availableCredit = wallet.credits_limit! - wallet.credits_used!
    if (availableCredit < totalDeduction)
      return {
        success: false,
        message: "Insufficient credit balance",
      }
    updateData.credits_used = wallet.credits_used! + totalDeduction
  }

  const { error: updateErr } = await db.from("wallets").update(updateData).eq("id", wallet.id)

  if (updateErr)
    return {
      success: false,
      message: "Wallet update failed",
    }

  // 4. Create wallet transaction
  const { data: txData, error: txErr } = await db
    .from("wallet_transactions")
    .insert({
      dealer_id: dealerId,
      wallet_id: wallet.id,
      amount: planAmount,
      type: "sale_deduction",
      source: "system",
      reference_type: "rsa_plan_sale",
      reference_id: saleId,
      note: `Deducted for RSA plan sale worth ₹${planAmount}`,
    })
    .select()
    .single()

  if (txErr)
    return {
      success: false,
      message: "Wallet transaction failed" + txErr.message,
    }

  // 7. Create sales record
  const { error: saleErr } = await db.from("sales").insert({
    dealer_id: dealerId,
    plan_id: planId,
    customer_id: customerId,
    total_amount: totalDeduction,
    sda_commission: parseFloat(sdaShare.toFixed(2)),
    dealer_commission: parseFloat(dealerShare.toFixed(2)),
    tds_amount: parseFloat(tdsAmount.toFixed(2)),
    commission_invoice_status: "pending",
    wallet_transaction_id: txData.id,
    rsa_plan_sales_id: saleId,
  })

  if (saleErr)
    return {
      success: false,
      message: "Failed to update sales record",
    }

  return {
    success: true,
    dealerShare,
    sdaShare,
  }
}

export const getDealerWallet = async (dealer_id: string) => {
  return await db.from("wallets").select("*").eq("id", dealer_id).eq("is_active", true).single()
}

export const createRazorpayFundAccount = async (payload: RazorpayXFundAccountInput) => {
  const { dealer_id, withdrawal_option_id } = payload

  // 1. Fetch bank account
  const { data: account, error } = await db
    .from("wallet_withdrawal_options")
    .select("*")
    .eq("id", withdrawal_option_id)
    .eq("dealer_id", dealer_id)
    .eq("is_default", true)
    .single()

  if (error || !account) {
    return { success: false, message: "Bank account not found" }
  }

  if (account.razorpayx_fund_account_id && account.razorpayx_fund_account_id !== "") {
    return { success: true, fund_account_id: account.razorpayx_fund_account_id }
  }

  // 2. Create Razorpay Contact
  const contactPayload = {
    name: account.account_holder_name,
    type: "dealer",
    reference_id: dealer_id,
    notes: { source: "SureDrive Wallet" },
  }

  const contactRes = await razorpayAxios.post("/contacts", contactPayload)
  const contact_id = contactRes.data?.id

  // 3. Create Fund Account
  const fundAccountPayload = {
    contact_id,
    account_type: "bank_account",
    bank_account: {
      name: account.account_holder_name,
      ifsc: account.ifsc_code,
      account_number: account.account_number,
    },
  }

  const fundRes = await razorpayAxios.post("/fund_accounts", fundAccountPayload)
  const fund_account_id = fundRes.data?.id

  // 4. Update in DB
  await db
    .from("wallet_withdrawal_options")
    .update({ razorpayx_fund_account_id: fund_account_id })
    .eq("id", withdrawal_option_id)

  return { success: true, fund_account_id }
}

export const getWalletId = async (dealer_id: string) => {
  const { data, error } = await db.from("wallets").select("id").eq("dealer_id", dealer_id).single()

  if (error) {
    return null
  }

  return data.id
}
