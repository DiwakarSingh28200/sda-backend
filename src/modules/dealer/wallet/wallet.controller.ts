import { Request, Response } from "express"
import { asyncHandler } from "../../../utils/asyncHandler"
import {
  getDealerWalletTransactions,
  getWalletByDealerId,
  getWithdrawalHistory,
  createWithdrawalRequest,
} from "./wallet.service"
import { WithdrawalRequestInput } from "./wallet.types"

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
    return res.status(404).json({
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
    return res.status(404).json({
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
    return res.status(404).json({
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
