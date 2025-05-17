"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutEmployeeService = exports.getLoggedInUserService = exports.getAllEmployeesService = exports.loginEmployeeService = void 0;
const db_1 = require("../../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginEmployeeService = async (body) => {
    const { employee_id, password } = body;
    const { data: employee, error: employeeError } = await db_1.db
        .from("employees")
        .select("id, employee_id, first_name, last_name, password, department:department_id(id, name)")
        .eq("employee_id", employee_id)
        .single();
    if (employeeError || !employee) {
        return {
            status: 401,
            success: false,
            message: "Invalid Employee ID or password.",
        };
    }
    if (!employee.password) {
        return {
            status: 400,
            success: false,
            message: "Employee password not set. Contact admin.",
        };
    }
    const isMatch = await bcrypt_1.default.compare(password, employee.password);
    if (!isMatch) {
        return {
            status: 401,
            success: false,
            message: "Invalid Employee ID or password.",
        };
    }
    const { data: roles } = await db_1.db
        .from("employee_roles")
        .select("role_id, roles(role, role_name)")
        .eq("employee_id", employee.id);
    if (!roles || roles.length === 0) {
        return {
            status: 403,
            success: false,
            message: "No roles assigned. Contact admin.",
        };
    }
    const roleIds = roles.map((r) => r.role_id);
    const roleNames = roles.map((r) => r.roles?.role_name.toLowerCase().split(" ").join("_") ?? "");
    const { data: permissions } = await db_1.db
        .from("role_permissions")
        .select("permission_id, permissions(name)")
        .in("role_id", roleIds);
    const permissionNames = permissions?.map((p) => p.permissions?.name ?? "") ?? [];
    const token = jsonwebtoken_1.default.sign({ id: employee.id, roles: roleNames, permissions: permissionNames }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return {
        status: 200,
        success: true,
        message: "Login successful.",
        token: token,
        data: {
            employee: {
                id: employee.id,
                employee_id: employee.employee_id,
                name: `${employee.first_name} ${employee.last_name}`,
                department: employee.department,
            },
            roles: roleNames,
            permissions: permissionNames,
        },
    };
};
exports.loginEmployeeService = loginEmployeeService;
const getAllEmployeesService = async () => {
    const { data, error } = await db_1.db.from("employees").select("*");
    if (error) {
        return {
            status: 500,
            success: false,
            message: "Error fetching employees.",
            error: error.message,
        };
    }
    return {
        status: 200,
        success: true,
        message: "Employees fetched successfully.",
        data,
    };
};
exports.getAllEmployeesService = getAllEmployeesService;
const getLoggedInUserService = async (userId) => {
    const { data: employee } = await db_1.db
        .from("employees")
        .select("id, employee_id, first_name, last_name, department:department_id(id, name)")
        .eq("id", userId)
        .single();
    if (!employee) {
        return { status: 404, success: false, message: "User not found." };
    }
    const { data: roles } = await db_1.db
        .from("employee_roles")
        .select("role_id, roles(role, role_name)")
        .eq("employee_id", employee.id);
    const roleIds = roles?.map((r) => r.role_id) ?? [];
    const roleNames = roles?.map((r) => r?.roles?.role_name.toLowerCase().split(" ").join("_")) ?? [];
    const { data: permissions } = await db_1.db
        .from("role_permissions")
        .select("permission_id, permissions(name)")
        .in("role_id", roleIds);
    const permissionNames = permissions?.map((p) => p?.permissions?.name ?? "") ?? [];
    return {
        status: 200,
        success: true,
        message: "Employee retrieved successfully.",
        data: {
            employee: {
                id: employee.id,
                employee_id: employee.employee_id,
                name: `${employee.first_name} ${employee.last_name}`,
                department: employee.department,
            },
            roles: roleNames,
            permissions: permissionNames,
        },
    };
};
exports.getLoggedInUserService = getLoggedInUserService;
const logoutEmployeeService = async (res) => {
    res.clearCookie("access_token");
    return {
        status: 200,
        success: true,
        message: "Logout successful.",
    };
};
exports.logoutEmployeeService = logoutEmployeeService;
