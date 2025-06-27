import { db } from "../../../config/db"
import moment from "moment"
export const getDealerSales = async (dealer_id: string, employee_id?: string) => {
  console.log("dealer_id", dealer_id)
  console.log("employee_id", employee_id)
  let query = db
    .from("rsa_plan_sales")
    .select(
      `
      policy_number,
      start_date,
      end_date,
      plan_duration_years,
      paid_amount,
      created_at,
      dealer_employees:sales_by(name),
      rsa_plans:plan_id(name),
      vehicles:vehicle_id(vehicle_registration_number, vehicle_model, customer:customer_id(first_name, last_name, phone))
      `
    )
    .eq("dealer_id", dealer_id)
    .order("created_at", { ascending: false })

  if (employee_id) {
    query = query.eq("sales_by", employee_id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return data.map((sale) => ({
    policy_number: sale.policy_number,
    customer_name: `${sale.vehicles?.customer?.first_name} ${sale.vehicles?.customer?.last_name}`,
    phone: sale.vehicles?.customer?.phone,
    plan_name: sale.rsa_plans?.name || "-",
    plan_duration_years: sale.plan_duration_years,
    start_date: moment(sale.start_date).format("ll"),
    end_date: moment(sale.end_date).format("ll"),
    paid_amount: sale.paid_amount,
    vehicle_model: sale.vehicles?.vehicle_model,
    vehicle_number: sale.vehicles?.vehicle_registration_number,
    sold_by: sale.dealer_employees?.name || "-",
    created_at: moment(sale.created_at).format("LLL"),
  }))
}

export const getDelaerSalesAndComissions = async (dealer_id: string) => {
  const { data, error } = await db
    .from("sales")
    .select(
      "id, plan:plan_id(id,name), customer:customer_id(first_name, last_name), policy_number:rsa_plan_sales_id(policy_number), total_amount, sda_commission, dealer_commission, tds_amount, created_at"
    )
    .eq("dealer_id", dealer_id)

  // cleanup "policy_number": {
  //     "policy_number": "HRHER47254225S"
  //   }

  if (!data) {
    return {
      success: false,
      message: "No sales found",
      data: [],
    }
  }

  if (error)
    return {
      success: false,
      message: "Failed to fetch sales and comissions",
      data: [],
    }

  const cleanedData = data.map((sale) => ({
    id: sale.id,
    customer_name: `${sale.customer?.first_name} ${sale.customer?.last_name}`,
    policy_number: sale.policy_number?.policy_number,
    plan: sale.plan?.name,
    total_amount: sale.total_amount,
    sda_commission: sale.sda_commission,
    dealer_commission: sale.dealer_commission,
    tds_amount: sale.tds_amount,
    created_at: moment(sale.created_at).format("LLL"),
  }))

  return {
    success: true,
    message: "Sales and comissions fetched successfully",
    data: cleanedData,
  }
}
