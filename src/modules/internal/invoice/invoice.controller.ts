import { Request, Response } from "express"
import { InvoiceService } from "./invoice.services"
import { asyncHandler } from "../../../utils/asyncHandler"

export const generateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoiceData = req.body

  // Generate PDF buffer
  const pdfBuffer = await InvoiceService.createInvoiceBuffer(invoiceData)

  // Send file as download
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${invoiceData.invoiceNumber || "invoice"}.pdf`,
    "Content-Length": pdfBuffer.length,
  })

  res.send(pdfBuffer)
})
