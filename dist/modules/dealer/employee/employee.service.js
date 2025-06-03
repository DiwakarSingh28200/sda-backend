"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDealerEmployeeService = exports.updateDealerEmployeeService = exports.addDealerEmployeeService = exports.getDealerEmployeeByDealerIDService = void 0;
const db_1 = require("../../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateDealerId_1 = require("../../../utils/generateDealerId");
const getDealerEmployeeByDealerIDService = async (dealer_id) => {
    const { data, error } = await db_1.db
        .from("dealer_employees")
        .select("id, employee_id, name, email, role, contact_number, created_at")
        .eq("dealer_id", dealer_id)
        .order("created_at", { ascending: true });
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
exports.getDealerEmployeeByDealerIDService = getDealerEmployeeByDealerIDService;
// Add dealer employee
const addDealerEmployeeService = async (dealerId, dealer_id, name, email, role, contact_number) => {
    try {
        // check if employee already exists with same name and phone number
        const { data: existingEmployee, error: existingEmployeeError } = await db_1.db
            .from("dealer_employees")
            .select("id")
            .eq("name", name)
            .eq("contact_number", contact_number);
        if (existingEmployeeError) {
            return {
                status: 400,
                success: false,
                message: existingEmployeeError.message,
            };
        }
        if (existingEmployee.length > 0) {
            return {
                status: 400,
                success: false,
                message: "Employee already exists with same name and phone number",
            };
        }
        const empId = await (0, generateDealerId_1.generateDealerEmployeeId)(dealer_id);
        const dealerEmpEmpPassword = "Dealer@1234";
        const dealerHashedPassword = await bcrypt_1.default.hash(dealerEmpEmpPassword, 10);
        if (empId) {
            const record = {
                dealer_id: dealerId,
                name,
                role,
                contact_number,
                email,
                employee_id: empId,
                password: dealerHashedPassword,
                login_enabled: true,
            };
            const { data, error } = await db_1.db.from("dealer_employees").insert(record);
            if (error) {
                return {
                    status: 500,
                    success: false,
                    message: error.message,
                };
            }
            return {
                status: 200,
                success: true,
                message: "Employee added successfully",
                data: data,
            };
        }
    }
    catch (error) {
        return {
            status: 500,
            success: false,
            message: error.message,
        };
    }
};
exports.addDealerEmployeeService = addDealerEmployeeService;
// Update dealer employee
const updateDealerEmployeeService = async (dealer_id, employee_id, name, email, role, contact_number) => {
    const { data, error } = await db_1.db
        .from("dealer_employees")
        .update({ name, email, role, contact_number })
        .eq("id", employee_id)
        .eq("dealer_id", dealer_id);
    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message,
        };
    }
    return {
        status: 200,
        success: true,
        message: "Employee updated successfully",
        data: data,
    };
};
exports.updateDealerEmployeeService = updateDealerEmployeeService;
const deleteDealerEmployeeService = async (dealer_id, employee_id) => {
    const { data, error } = await db_1.db
        .from("dealer_employees")
        .delete()
        .eq("id", employee_id)
        .eq("dealer_id", dealer_id);
    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message,
        };
    }
    return {
        status: 200,
        success: true,
        message: "Employee deleted successfully",
        data: data,
    };
};
exports.deleteDealerEmployeeService = deleteDealerEmployeeService;
