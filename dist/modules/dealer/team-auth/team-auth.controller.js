"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutDealerEmployeeHandler = exports.getLoggedInDealerEmployeeHandler = exports.loginDealerEmployeeHandler = void 0;
const team_auth_service_1 = require("./team-auth.service");
const loginDealerEmployeeHandler = async (req, res) => {
    const result = await (0, team_auth_service_1.loginDealerEmployeeService)(req.body);
    if (result.token) {
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
exports.loginDealerEmployeeHandler = loginDealerEmployeeHandler;
const getLoggedInDealerEmployeeHandler = async (req, res) => {
    const result = await (0, team_auth_service_1.getLoggedInDealerEmployeeService)(req.dealerEmployee.id);
    return res.status(result.status).json(result);
};
exports.getLoggedInDealerEmployeeHandler = getLoggedInDealerEmployeeHandler;
const logoutDealerEmployeeHandler = async (_req, res) => {
    const result = await (0, team_auth_service_1.logoutDealerEmployeeService)(res);
    return res.status(result.status).json(result);
};
exports.logoutDealerEmployeeHandler = logoutDealerEmployeeHandler;
