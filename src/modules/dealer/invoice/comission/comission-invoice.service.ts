import { db } from "../../../../config/db"

export const getComissionInvoiceService = async (dealer_id: string) => {
  const { data, error } = await db
    .from("dealer_commission_invoices")
    .select("*")
    .eq("dealer_id", dealer_id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    }
  }

  return {
    success: true,
    message: "Comission invoice fetched successfully",
    data,
  }
}

export const createComissionInvoiceService = async (
  payload: {
    doc_type: string
    other_reason: string
    doc_date: string
    doc_amount: number
    doc_number: string
    file: string
    doc_desc: string
  },
  dealer_id: string
) => {
  const { data, error } = await db.from("dealer_commission_invoices").insert({
    dealer_id,
    ...payload,
  })

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    }
  }

  return {
    success: true,
    message: "Comission invoice created successfully",
    data,
  }
}
