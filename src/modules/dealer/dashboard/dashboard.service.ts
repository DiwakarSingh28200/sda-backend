import { db } from "../../../config/db"

// 🟢 1. Top Cards
export const getDealerMetricsService = async (dealer_id: string) => {
  const [customerCount, planCount, employeeCount] = await Promise.all([
    db.from("customers").select("*", { count: "exact", head: true }).eq("dealer_id", dealer_id),
    db
      .from("rsa_plan_sales")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealer_id),
    db
      .from("dealer_employees")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealer_id),
  ])

  // Optional revenue via sum
  const { data: revenueData, error: revenueError } = await db
    .from("rsa_plan_sales")
    .select("paid_amount")
    .eq("dealer_id", dealer_id)

  const totalRevenue = revenueData?.reduce((acc, sale) => acc + (sale.paid_amount || 0), 0) || 0

  return {
    total_customers: customerCount.count || 0,
    total_rsa_plans: planCount.count || 0,
    total_revenue: totalRevenue,
    active_employees: employeeCount.count || 0,
  }
}

// 🟦 2. Sales Chart (This Month)
export const getSalesChartService = async (dealer_id: string) => {
  const { data, error } = await db.rpc("get_monthly_sales_chart", { input_dealer_id: dealer_id })

  if (error) throw new Error(error.message)

  // fallback: create bar data from 1–31 with count 0 if missing
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const result = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, "0")
    const found = data.find((d) => d.day === day)
    return {
      day,
      count: found?.count || 0,
    }
  })

  return result
}

// 🟨 3. Top Employees
export const getTopEmployeesService = async (dealer_id: string) => {
  const { data, error } = await db.rpc("get_top_dealer_employees", { dealer_input: dealer_id })

  if (error) throw new Error(error.message)

  return data.map((emp, index) => ({
    rank: index + 1,
    name: emp.name,
    total_customers: emp.total_customers,
    total_revenue: emp.total_revenue,
  }))
}

// 🟪 4. Plan Type Breakdown
export const getPlanTypeStatsService = async (dealer_id: string) => {
  const { data, error } = await db.rpc("get_plan_type_stats", { dealer_input: dealer_id })

  if (error) throw new Error(error.message)

  return data.map((plan) => ({
    type: plan.name,
    count: plan.count,
    percentage: plan.percentage,
  }))
}
