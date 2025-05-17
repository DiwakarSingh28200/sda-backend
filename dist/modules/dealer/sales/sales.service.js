"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDealerSales = void 0;
const db_1 = require("../../../config/db");
const moment_1 = __importDefault(require("moment"));
const getDealerSales = async (dealer_id, employee_id) => {
    console.log("dealer_id", dealer_id);
    console.log("employee_id", employee_id);
    let query = db_1.db
        .from("rsa_plan_sales")
        .select(`
      policy_number,
      start_date,
      end_date,
      plan_duration_years,
      paid_amount,
      created_at,
      dealer_employees:sales_by(name),
      rsa_plans:plan_id(name),
      vehicles:vehicle_id(vehicle_registration_number, vehicle_model, customer:customer_id(first_name, last_name, phone))
      `)
        .eq("dealer_id", dealer_id)
        .order("created_at", { ascending: false });
    if (employee_id) {
        query = query.eq("sales_by", employee_id);
    }
    const { data, error } = await query;
    if (error)
        throw new Error(error.message);
    return data.map((sale) => ({
        policy_number: sale.policy_number,
        customer_name: `${sale.vehicles?.customer?.first_name} ${sale.vehicles?.customer?.last_name}`,
        phone: sale.vehicles?.customer?.phone,
        plan_name: sale.rsa_plans?.name || "-",
        plan_duration_years: sale.plan_duration_years,
        start_date: (0, moment_1.default)(sale.start_date).format("ll"),
        end_date: (0, moment_1.default)(sale.end_date).format("ll"),
        paid_amount: sale.paid_amount,
        vehicle_model: sale.vehicles?.vehicle_model,
        vehicle_number: sale.vehicles?.vehicle_registration_number,
        sold_by: sale.dealer_employees?.name || "-",
        created_at: (0, moment_1.default)(sale.created_at).format("LLL"),
    }));
};
exports.getDealerSales = getDealerSales;
