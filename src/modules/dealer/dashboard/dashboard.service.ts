import moment from "moment"
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
// export const getSalesChartService = async (dealer_id: string) => {
//   const { data, error } = await db.rpc("get_monthly_sales_chart", { input_dealer_id: dealer_id })

//   if (error) throw new Error(error.message)

//   // i want this function more dynamic, so that it can be used for any month and year. we can get option from payload like month and year.
//   // if month and year is not provided, it will default to current month and year.
//   // can we do like 7 days, month, quaterly, and yearly. use moment library
//   // in chart i want x axis as month and year and y axis as count day data.

//   // fallback: create bar data from 1–31 with count 0 if missing
//   const today = new Date()
//   const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
//   const result = Array.from({ length: daysInMonth }, (_, i) => {
//     const day = (i + 1).toString().padStart(2, "0")
//     const found = data.find((d) => d.day === day)
//     return {
//       day,
//       count: found?.count || 0,
//     }
//   })

//   return result
// }

type SalesChartPayload = {
  dealer_id: string
  range?: "7d" | "monthly" | "quarterly" | "yearly"
  month?: number
  year?: number
}

export const getSalesChartService = async ({
  dealer_id,
  range = "monthly",
  month,
  year,
}: SalesChartPayload) => {
  const { data, error } = await db.rpc("get_sales_chart", {
    input_dealer_id: dealer_id,
    range_type: range,
    input_month: month ?? undefined,
    input_year: year ?? undefined,
  })

  if (error) throw new Error(error.message)

  let result: any = []

  if (range === "7d") {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      moment()
        .subtract(6 - i, "days")
        .format("YYYY-MM-DD")
    )

    result = last7Days.map((day) => {
      const found = data.find((d) => d.day === day)
      return { day, count: found?.count || 0 }
    })
  } else if (range === "monthly") {
    const selectedMonth = month ?? moment().month() + 1
    const selectedYear = year ?? moment().year()
    const daysInMonth = moment(`${selectedYear}-${selectedMonth}`, "YYYY-MM").daysInMonth()

    result = Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, "0")
      const found = data.find((d) => d.day === day)
      return { day, count: found?.count || 0 }
    })
  } else if (range === "yearly") {
    result = Array.from({ length: 12 }, (_, i) => {
      const monthStr = moment().month(i).format("YYYY-MM")
      const found = data.find((d) => d.day === monthStr)
      return { day: monthStr, count: found?.count || 0 }
    })
  } else if (range === "quarterly") {
    const currentYear = year ?? moment().year()
    const currentQuarter = Math.floor(moment().month() / 3) + 1
    const startMonth = (currentQuarter - 1) * 3
    const quarterMonths = Array.from({ length: 3 }, (_, i) =>
      moment()
        .year(currentYear)
        .month(startMonth + i)
        .format("YYYY-MM")
    )

    result = quarterMonths.map((monthStr) => {
      const found = data.find((d) => d.day === monthStr)
      return { day: monthStr, count: found?.count || 0 }
    })
  }

  return result
}

// 🟨 3. Top Employees
export const getTopEmployeesService = async (dealer_id: string) => {
  console.log("getTopEmployeesService dealer_id", dealer_id)

  const { data, error } = await db
    .from("rsa_plan_sales")
    .select(
      `
      sales_by,
      paid_amount,
      dealer_employees!sales_by (
        name
      )
    `
    )
    .eq("dealer_id", dealer_id)

  if (error) throw new Error(error.message)

  // Aggregate by employee
  const employeeStats: Record<
    string,
    { name: string; total_customers: number; total_revenue: number }
  > = {}

  for (const sale of data) {
    const employeeId = sale.sales_by
    const name = sale.dealer_employees?.name ?? "Unknown"

    if (!employeeStats[employeeId]) {
      employeeStats[employeeId] = {
        name,
        total_customers: 0,
        total_revenue: 0,
      }
    }

    employeeStats[employeeId].total_customers += 1
    employeeStats[employeeId].total_revenue += Number(sale.paid_amount || 0)
  }

  // Convert to sorted array
  const topEmployees = Object.values(employeeStats)
    .sort((a, b) => b.total_customers - a.total_customers)
    .slice(0, 4)
    .map((emp, index) => ({
      rank: index + 1,
      ...emp,
    }))

  return topEmployees
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
