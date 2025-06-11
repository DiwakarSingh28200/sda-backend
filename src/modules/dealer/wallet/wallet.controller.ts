import { Request, Response } from "express"
import { asyncHandler } from "../../../utils/asyncHandler"
import {
  getDealerWalletTransactions,
  getWalletByDealerId,
  getWithdrawalHistory,
  createWithdrawalRequest,
  insertManualPaymentRequest,
  createBankAccount,
  getBankAccounts,
  removeBankAccount,
  markBankAccountAsDefault,
  updateBankAccount,
  initiateWalletPaymentService,
  handleWalletPaymentSuccess,
} from "./wallet.service"
import { WithdrawalRequestInput } from "./wallet.types"
import {
  AddBankAccountSchema,
  ManualPaymentRequestSchema,
  UpdateBankAccountSchema,
  WalletPaymentInitiateSchema,
  WalletPaymentSuccessSchema,
} from "./wallet.schema"
import { zodErrorFormatter } from "../../../utils/index"

export const getWalletBalance = asyncHandler(async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  const wallet = await getWalletByDealerId(dealer_id)

  if (!wallet) {
    return res.status(200).json({
      success: false,
      message: "Wallet not found for dealer",
    })
  }

  res.json({
    success: true,
    message: "Wallet fetched successfully",
    data: {
      cash_balance: wallet.cash_balance,
      credits_limit: wallet.credits_limit,
      credits_used: wallet.credits_used,
      is_active: wallet.is_active,
    },
  })
})

export const getTransactionHistory = asyncHandler(async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  const {
    type,
    from,
    to,
    search,
    limit = 10,
    offset = 0,
  } = req.query as {
    type?: string
    from?: string
    to?: string
    search?: string
    limit?: string
    offset?: string
  }

  const result = await getDealerWalletTransactions(dealer_id, {
    type: type?.toString(),
    from: from?.toString(),
    to: to?.toString(),
    search: search?.toString(),
    limit: Number(limit),
    offset: Number(offset),
  })

  if (result?.transactions.length === 0) {
    return res.status(200).json({
      success: false,
      message: "No transactions found",
      data: {
        transactions: [],
        total_count: 0,
        next_from: 0,
        has_more: false,
      },
    })
  }

  res.json({
    success: true,
    message: "Transaction history fetched successfully",
    data: result,
  })
})

export const getWithdrawalHistoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  const {
    status,
    from,
    limit = 10,
  } = req.query as {
    status?: string
    from?: string
    limit?: string
  }

  const result = await getWithdrawalHistory(dealer_id, {
    status: status?.toString(),
    from: Number(from),
    limit: Number(limit),
  })

  if (!result) {
    return res.status(200).json({
      success: false,
      message: "No withdrawals found",
      data: {
        withdrawals: [],
        total_count: 0,
        next_from: 0,
        has_more: false,
      },
    })
  }

  res.json({
    success: true,
    message: "Withdrawal history fetched successfully",
    data: result,
  })
})

export const createWithdrawalRequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  const { amount, bank_account_id } = req.body as WithdrawalRequestInput

  const result = await createWithdrawalRequest(dealer_id, { amount, bank_account_id })

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.json({
    success: true,
    message: "Withdrawal request created successfully",
    data: result,
  })
})

export const submitManualPayment = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }
  const payload = ManualPaymentRequestSchema.parse(req.body)

  const payment = await insertManualPaymentRequest(dealer_id, payload)

  res.status(201).json({
    success: true,
    message: "Manual payment submitted",
    data: payment,
  })
})

export const createBankAccountHandler = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  const parse = AddBankAccountSchema.safeParse(req.body)

  if (!parse.success) {
    const messages: string[] = []
    for (const issue of parse.error.issues) {
      const label = zodErrorFormatter(issue.path as string[])
      messages.push(`${label}: ${issue.message}`)
    }

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    })
  }

  const result = await createBankAccount(dealer_id, parse.data)

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.json({
    success: true,
    message: "Bank account created successfully",
    data: result.data,
  })
})

export const updateBankAccountHandler = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id
  const id = req.params.id as string

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Bank account ID is required",
    })
  }

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  const parse = UpdateBankAccountSchema.safeParse(req.body)

  if (!parse.success) {
    const messages: string[] = []
    for (const issue of parse.error.issues) {
      const label = zodErrorFormatter(issue.path as string[])
      messages.push(`${label}: ${issue.message}`)
    }

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    })
  }

  const result = await updateBankAccount(dealer_id, id, parse.data)

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.json({
    success: true,
    message: "Bank account updated successfully",
    data: result.data,
  })
})

export const listBankAccounts = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  const accounts = await getBankAccounts(dealer_id)

  if (!accounts.success) {
    return res.status(500).json(accounts)
  }

  res.json({
    success: true,
    message: "Bank accounts fetched",
    data: accounts,
  })
})

export const deleteBankAccount = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id
  const id = req.params.id

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Bank account ID is required",
    })
  }

  const result = await removeBankAccount(dealer_id, id)

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.json({
    success: true,
    message: "Bank account deleted successfully",
  })
})

export const setDefaultBankAccount = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id
  const id = req.params.id as string

  console.log(dealer_id, id)

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Bank account ID is required",
    })
  }

  const result = await markBankAccountAsDefault(dealer_id, id)

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.json({
    success: true,
    message: "Default bank account updated",
    data: result.data,
  })
})

export const initiateWalletPayment = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id
  const payload = WalletPaymentInitiateSchema.safeParse(req.body)

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  if (!payload.success) {
    const messages: string[] = []
    for (const issue of payload.error.issues) {
      const label = zodErrorFormatter(issue.path as string[])
      messages.push(`${label}: ${issue.message}`)
    }

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    })
  }

  const result = await initiateWalletPaymentService(dealer_id, payload.data)

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.json({
    success: true,
    message: "Payment initiated and stored",
    data: result.data,
  })
})

export const markWalletPaymentSuccess = asyncHandler(async (req, res) => {
  const dealer_id = req.dealer?.id
  const payload = WalletPaymentSuccessSchema.safeParse(req.body)

  if (!dealer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  if (!payload.success) {
    const messages: string[] = []
    for (const issue of payload.error.issues) {
      const label = zodErrorFormatter(issue.path as string[])
      messages.push(`${label}: ${issue.message}`)
    }
  }

  if (!payload.data) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
    })
  }

  const result = await handleWalletPaymentSuccess(dealer_id, payload.data)

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.json({
    success: true,
    message: "Wallet payment captured and wallet updated",
    data: result.data,
  })
})
