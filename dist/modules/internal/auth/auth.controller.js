"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutEmployeeHandler = exports.getLoggedInUserHandler = exports.getAllEmployeesHandler = exports.loginEmployeeHandler = void 0;
const auth_service_1 = require("./auth.service");
const loginEmployeeHandler = async (req, res) => {
    const result = await (0, auth_service_1.loginEmployeeService)(req.body);
    if (result.status === 200) {
        return res
            .cookie("access_token", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
            .json({
            status: 200,
            success: true,
            message: "Login successful.",
            data: result.data,
        });
    }
    return res.status(result.status).json(result);
};
exports.loginEmployeeHandler = loginEmployeeHandler;
const getAllEmployeesHandler = async (_req, res) => {
    const result = await (0, auth_service_1.getAllEmployeesService)();
    return res.status(result.status).json(result);
};
exports.getAllEmployeesHandler = getAllEmployeesHandler;
const getLoggedInUserHandler = async (req, res) => {
    const result = await (0, auth_service_1.getLoggedInUserService)(req.user.id);
    return res.status(result.status).json(result);
};
exports.getLoggedInUserHandler = getLoggedInUserHandler;
const logoutEmployeeHandler = async (_req, res) => {
    const result = await (0, auth_service_1.logoutEmployeeService)(res);
    return res.status(result.status).json(result);
};
exports.logoutEmployeeHandler = logoutEmployeeHandler;
