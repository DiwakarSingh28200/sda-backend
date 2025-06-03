"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutDealerEmployeeService = exports.getLoggedInDealerEmployeeService = exports.loginDealerEmployeeService = void 0;
const db_1 = require("../../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginDealerEmployeeService = async (body) => {
    const { employee_id, password } = body;
    const { data: emp } = await db_1.db
        .from("dealer_employees")
        .select("id, name, employee_id, password, role, email, dealer:dealer_id(id, dealership_name, oem)")
        .eq("employee_id", employee_id)
        .single();
    if (!emp || !emp.password) {
        return {
            status: 401,
            success: false,
            message: "Invalid login credentials",
        };
    }
    const isMatch = await bcrypt_1.default.compare(password, emp.password);
    if (!isMatch) {
        return {
            status: 401,
            success: false,
            message: "Invalid login credentials",
        };
    }
    const token = jsonwebtoken_1.default.sign({
        id: emp.id,
        dealer_id: emp.dealer.id,
        is_dealer_employee: true,
        roles: ["employee"],
        permissions: [],
    }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return {
        status: 200,
        success: true,
        message: "Login successful",
        token: token,
        data: {
            user: {
                id: emp.id,
                employee_id: emp.employee_id,
                name: emp.name,
                dealer_id: emp.dealer.id,
                dealership_name: emp.dealer.dealership_name,
                role: emp.role || "employee",
                email: emp.email || null,
                type: "employee",
                oem: emp.dealer.oem,
            },
            dealer_id: emp.dealer.id,
            sub_dealers: [],
            roles: ["employee"],
            permissions: [],
        },
    };
};
exports.loginDealerEmployeeService = loginDealerEmployeeService;
const getLoggedInDealerEmployeeService = async (id) => {
    const { data: emp } = await db_1.db
        .from("dealer_employees")
        .select("id, name, employee_id, role, email, dealer:dealer_id(id, dealership_name, oem)")
        .eq("id", id)
        .single();
    if (!emp) {
        return {
            status: 404,
            success: false,
            message: "Employee not found",
        };
    }
    return {
        status: 200,
        success: true,
        message: "Employee profile loaded",
        data: {
            user: {
                id: emp.id,
                employee_id: emp.employee_id,
                name: emp.name,
                dealer_id: emp.dealer.id,
                dealership_name: emp.dealer.dealership_name,
                role: emp.role || "employee",
                type: "employee",
                email: emp.email || null,
                oem: emp.dealer.oem,
            },
            dealer_id: emp.dealer.id,
            sub_dealers: [],
            roles: ["employee"],
            permissions: [],
        },
    };
};
exports.getLoggedInDealerEmployeeService = getLoggedInDealerEmployeeService;
const logoutDealerEmployeeService = async (res) => {
    res.clearCookie("dealer_employee_token");
    return {
        status: 200,
        success: true,
        message: "Logout successful",
    };
};
exports.logoutDealerEmployeeService = logoutDealerEmployeeService;
