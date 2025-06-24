import { generateInvoicePdf } from "./invoice.utils"

export const InvoiceService = {
  async createInvoiceBuffer(invoiceData: Record<string, string | number>) {
    const pdfBuffer = await generateInvoicePdf(invoiceData)
    return pdfBuffer
  },
}
