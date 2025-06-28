import { Request, Response } from "express"
import {
  getComissionInvoiceService,
  createComissionInvoiceService,
} from "./comission-invoice.service"
import { asyncHandler } from "../../../../utils/asyncHandler"

export const getComissionInvoiceController = asyncHandler(async (req: Request, res: Response) => {
  const dealer_id = req.dealer?.id!
  const { success, message, data } = await getComissionInvoiceService(dealer_id)

  if (!success) {
    return res.status(400).json({ message })
  }

  return res.status(200).json({ message, data })
})

export const createComissionInvoiceController = asyncHandler(
  async (req: Request, res: Response) => {
    const dealer_id = req.dealer?.id as string
    const payload = req.body as {
      doc_type: string
      other_reason: string
      doc_date: string
      doc_amount: number
      doc_number: string
      file: string
      doc_desc: string
    }

    if (!dealer_id) {
      return res.status(400).json({ message: "Unauthorized" })
    }

    const { success, message, data } = await createComissionInvoiceService(payload, dealer_id)

    if (!success) {
      return res.status(400).json({ message })
    }

    return res.status(200).json({ message, data })
  }
)
