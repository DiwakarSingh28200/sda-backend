import { Request, Response } from "express"
import { asyncHandler } from "../../../utils/asyncHandler"
import {
  getAllManualPaymentRequests,
  getManualPaymentRequestById,
  createWalletConfigEntry,
  updateManualPaymentStatus,
  getLatestWalletConfigEntry,
  updateWalletConfigEntry,
} from "./wallet.service"
import { WithdrawalRequestInput } from "./wallet.types"
import {
  ManualPaymentApprovalSchema,
  ManualPaymentRequestSchema,
  WalletConfigSchema,
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
