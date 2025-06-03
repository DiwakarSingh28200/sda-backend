"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanTypeStatsService = exports.getTopEmployeesService = exports.getSalesChartService = exports.getDealerMetricsService = void 0;
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../../../config/db");
// 🟢 1. Top Cards
const getDealerMetricsService = async (dealer_id) => {
    const [customerCount, planCount, employeeCount] = await Promise.all([
        db_1.db.from("customers").select("*", { count: "exact", head: true }).eq("dealer_id", dealer_id),
        db_1.db
            .from("rsa_plan_sales")
            .select("*", { count: "exact", head: true })
            .eq("dealer_id", dealer_id),
        db_1.db
            .from("dealer_employees")
            .select("*", { count: "exact", head: true })
            .eq("dealer_id", dealer_id),
    ]);
    // Optional revenue via sum
    const { data: revenueData, error: revenueError } = await db_1.db
        .from("rsa_plan_sales")
        .select("paid_amount")
        .eq("dealer_id", dealer_id);
    const totalRevenue = revenueData?.reduce((acc, sale) => acc + (sale.paid_amount || 0), 0) || 0;
    return {
        total_customers: customerCount.count || 0,
        total_rsa_plans: planCount.count || 0,
        total_revenue: totalRevenue,
        active_employees: employeeCount.count || 0,
    };
};
exports.getDealerMetricsService = getDealerMetricsService;
const getSalesChartService = async ({ dealer_id, range = "monthly", month, year, }) => {
    const { data, error } = await db_1.db.rpc("get_sales_chart", {
        input_dealer_id: dealer_id,
        range_type: range,
        input_month: month ?? undefined,
        input_year: year ?? undefined,
    });
    if (error)
        throw new Error(error.message);
    let result = [];
    if (range === "7d") {
        const last7Days = Array.from({ length: 7 }, (_, i) => (0, moment_1.default)()
            .subtract(6 - i, "days")
            .format("YYYY-MM-DD"));
        result = last7Days.map((day) => {
            const found = data.find((d) => d.day === day);
            return { day, count: found?.count || 0 };
        });
    }
    else if (range === "monthly") {
        const selectedMonth = month ?? (0, moment_1.default)().month() + 1;
        const selectedYear = year ?? (0, moment_1.default)().year();
        const daysInMonth = (0, moment_1.default)(`${selectedYear}-${selectedMonth}`, "YYYY-MM").daysInMonth();
        result = Array.from({ length: daysInMonth }, (_, i) => {
            const day = String(i + 1).padStart(2, "0");
            const found = data.find((d) => d.day === day);
            return { day, count: found?.count || 0 };
        });
    }
    else if (range === "yearly") {
        result = Array.from({ length: 12 }, (_, i) => {
            const monthStr = (0, moment_1.default)().month(i).format("YYYY-MM");
            const found = data.find((d) => d.day === monthStr);
            return { day: monthStr, count: found?.count || 0 };
        });
    }
    else if (range === "quarterly") {
        const currentYear = year ?? (0, moment_1.default)().year();
        const currentQuarter = Math.floor((0, moment_1.default)().month() / 3) + 1;
        const startMonth = (currentQuarter - 1) * 3;
        const quarterMonths = Array.from({ length: 3 }, (_, i) => (0, moment_1.default)()
            .year(currentYear)
            .month(startMonth + i)
            .format("YYYY-MM"));
        result = quarterMonths.map((monthStr) => {
            const found = data.find((d) => d.day === monthStr);
            return { day: monthStr, count: found?.count || 0 };
        });
    }
    return result;
};
exports.getSalesChartService = getSalesChartService;
// 🟨 3. Top Employees
const getTopEmployeesService = async (dealer_id) => {
    console.log("getTopEmployeesService dealer_id", dealer_id);
    const { data, error } = await db_1.db
        .from("rsa_plan_sales")
        .select(`
      sales_by,
      paid_amount,
      dealer_employees!sales_by (
        name
      )
    `)
        .eq("dealer_id", dealer_id);
    if (error)
        throw new Error(error.message);
    // Aggregate by employee
    const employeeStats = {};
    for (const sale of data) {
        const employeeId = sale.sales_by;
        const name = sale.dealer_employees?.name ?? "Unknown";
        if (!employeeStats[employeeId]) {
            employeeStats[employeeId] = {
                name,
                total_customers: 0,
                total_revenue: 0,
            };
        }
        employeeStats[employeeId].total_customers += 1;
        employeeStats[employeeId].total_revenue += Number(sale.paid_amount || 0);
    }
    // Convert to sorted array
    const topEmployees = Object.values(employeeStats)
        .sort((a, b) => b.total_customers - a.total_customers)
        .slice(0, 4)
        .map((emp, index) => ({
        rank: index + 1,
        ...emp,
    }));
    return topEmployees;
};
exports.getTopEmployeesService = getTopEmployeesService;
// 🟪 4. Plan Type Breakdown
const getPlanTypeStatsService = async (dealer_id) => {
    const { data, error } = await db_1.db.rpc("get_plan_type_stats", { dealer_input: dealer_id });
    if (error)
        throw new Error(error.message);
    return data.map((plan) => ({
        type: plan.name,
        count: plan.count,
        percentage: plan.percentage,
    }));
};
exports.getPlanTypeStatsService = getPlanTypeStatsService;
