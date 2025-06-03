"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutDealerEmployeeHandler = exports.getLoggedInDealerEmployeeHandler = exports.loginDealerEmployeeHandler = void 0;
const team_auth_service_1 = require("./team-auth.service");
const loginDealerEmployeeHandler = async (req, res) => {
    const result = await (0, team_auth_service_1.loginDealerEmployeeService)(req.body);
    if (result.token) {
        return res
            .cookie("dealer_employee_token", result.token, {
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
    const cookieName = "dealer_employee_token";
    const cookieOptions = {
        domain: process.env.COOKIE_DOMAIN,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };
    res.clearCookie(cookieName, cookieOptions);
    return res.status(200).json({
        status: 200,
        success: true,
        message: "Logout successful",
    });
};
exports.logoutDealerEmployeeHandler = logoutDealerEmployeeHandler;
