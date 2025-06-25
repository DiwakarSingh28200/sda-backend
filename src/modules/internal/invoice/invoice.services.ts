import { db } from "../../../config/db"
import { generateInvoicePdf } from "./invoice.utils"

export const InvoiceService = {
  async createInvoiceBuffer(invoiceData: Record<string, string | number>) {
    const pdfBuffer = await generateInvoicePdf(invoiceData)
    return pdfBuffer
  },
}

export const generateInvoiceFromSaleId = async (saleId: string) => {
  // 1. Fetch sale with dealer and rsa_plan_sales
  const { data: sale, error } = await db
    .from("sales")
    .select(
      `
      *,
        dealers:dealer_id (
          dealership_name,
          registered_address,
          pan_number,
          gst_number,
          email,
          operations_contact_phone,
          dealer_id
        ),
        rsa_plan_sales:rsa_plan_sales_id (
          policy_number,
          created_at,
          plan_duration_years
        )
    `
    )
    .eq("id", saleId)
    .single()

  if (error || !sale) throw new Error("Sale record not found")

  // 2. Map DB data → template variables
  const invoiceData = {
    invoiceNumber: sale.rsa_plan_sales?.policy_number || "",
    invoiceDate: new Date(sale.created_at!).toLocaleDateString("en-IN"),
    dealerId: sale.dealers?.dealer_id || "-",
    placeOfSupply: "Maharashtra (27)",

    billingName: sale.dealers?.dealership_name || "",
    billingAddress: sale.dealers?.registered_address || "",
    billingPan: sale.dealers?.pan_number || "",
    billingGstin: sale.dealers?.gst_number || "",
    billingPhone: sale.dealers?.operations_contact_phone || "",
    billingEmail: sale.dealers?.email || "",

    shippingName: sale.dealers?.dealership_name || "",
    shippingAddress: sale.dealers?.registered_address || "",
    shippingPan: sale.dealers?.pan_number || "",
    shippingGstin: sale.dealers?.gst_number || "",
    shippingPhone: sale.dealers?.operations_contact_phone || "",
    shippingEmail: sale.dealers?.email || "",

    itemDescription: `Roadside Assistance Subscription – ${sale.rsa_plan_sales?.plan_duration_years} Year(s)`,
    sacCode: "998729",
    qty: 1,
    rate: Number(sale.total_amount),
    cgst: "0.00",
    sgst: "0.00",
    igst: 56.44,
    amount: Number(sale.sda_commission),
    amountInWords: "Indian Rupees " + toWords(Number(sale.sda_commission)) + " Only",
    taxableValue: Number(sale.sda_commission) - 56.44,
    cgstTotal: "0.00",
    sgstTotal: "0.00",
    igstTotal: 56.44,
    commission: Number(sale.dealer_commission),
    tds: Number(sale.tds_amount),
    totalInvoiceValue: Number(sale.sda_commission) + Number(sale.tds_amount),
    logoUrl: "https://sda.vinaydemos.site/assets/images/logo.svg",
  }

  // 3. Generate PDF
  const pdfBuffer = await generateInvoicePdf(invoiceData)
  return pdfBuffer
}

function toWords(amount: number): string {
  return amount.toFixed(2)
}
