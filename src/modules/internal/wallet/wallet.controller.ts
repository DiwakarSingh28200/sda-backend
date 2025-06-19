import { Request, Response } from "express"
import { asyncHandler } from "../../../utils/asyncHandler"
import {
  getAllManualPaymentRequests,
  getManualPaymentRequestById,
  createWalletConfigEntry,
  updateManualPaymentStatus,
  getLatestWalletConfigEntry,
  updateWalletConfigEntry,
  handleWithdrawalApproval,
  processWithdrawalPayout,
  getAllWithdrawalsForAdmin,
} from "./wallet.service"
import {
  ManualPaymentApprovalSchema,
  ManualPaymentRequestSchema,
  WalletConfigSchema,
  ApproveWithdrawalSchema,
} from "./wallet.schema"
import { zodErrorFormatter } from "../../../utils/index"

export const approveManualPayment = asyncHandler(async (req, res) => {
  const id = req.params.id
  const parse = ManualPaymentApprovalSchema.safeParse(req.body)

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

  const updated = await updateManualPaymentStatus(id, parse.data)

  if (!updated.success) {
    return res.status(400).json(updated)
  }

  res.json({
    success: true,
    message: `Manual payment request ${parse.data.status}`,
    data: updated,
  })
})

export const getAllManualPaymentRequestsHandler = asyncHandler(async (req, res) => {
  const requests = await getAllManualPaymentRequests()

  if (!requests.success) {
    return res.status(400).json(requests)
  }

  res.json({
    success: true,
    message: "Manual payment requests fetched successfully",
    data: requests.data,
  })
})

export const getManualPaymentRequestByIdHandler = asyncHandler(async (req, res) => {
  const id = req.params.id
  const request = await getManualPaymentRequestById(id)

  if (!request.success) {
    return res.status(400).json(request)
  }

  res.json({
    success: true,
    message: "Manual payment request fetched successfully",
    data: request,
  })
})

export const createWalletConfigEntryHandler = asyncHandler(async (req, res) => {
  const payload = WalletConfigSchema.parse(req.body)

  const created = await createWalletConfigEntry(payload)

  if (!created.success) {
    return res.status(400).json(created)
  }

  res.json({
    success: true,
    message: "Wallet config created",
    data: created,
  })
})

export const getLatestWalletConfigEntryHandler = asyncHandler(async (req, res) => {
  const config = await getLatestWalletConfigEntry()

  if (!config.success) {
    return res.status(400).json(config)
  }

  res.json({
    success: true,
    message: "Wallet config fetched successfully",
    data: config,
  })
})

export const updateWalletConfigEntryHandler = asyncHandler(async (req, res) => {
  const id = req.params.id
  const payload = WalletConfigSchema.parse(req.body)

  const updated = await updateWalletConfigEntry(id, payload)

  if (!updated.success) {
    return res.status(400).json(updated)
  }

  res.json({
    success: true,
    message: "Wallet config updated",
    data: updated,
  })
})

export const approveWithdrawal = asyncHandler(async (req, res) => {
  const id = req.params.id
  const payload = ApproveWithdrawalSchema.parse(req.body)

  const result = await handleWithdrawalApproval(id, payload)

  res.json({
    success: true,
    message: "Withdrawal marked as paid",
    data: result,
  })
})

export const processWithdrawalPayoutHandler = asyncHandler(async (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Withdrawal ID is required",
    })
  }

  const result = await processWithdrawalPayout(id)

  res.json({
    success: true,
    message: "Withdrawal processed",
    data: result,
  })
})

export const handleAdminWithdrawalsList = asyncHandler(async (req: Request, res: Response) => {
  const { status, dealer_id, from_date, to_date, page, limit } = req.query

  const result = await getAllWithdrawalsForAdmin({
    status: status as string,
    dealer_id: dealer_id as string,
    from_date: from_date as string,
    to_date: to_date as string,
    page: Number(page),
    limit: Number(limit),
  })

  if (!result.success) {
    return res.status(400).json(result)
  }

  return res.json(result)
})
