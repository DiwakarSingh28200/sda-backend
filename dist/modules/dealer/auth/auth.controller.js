"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutDealerHandler = exports.getLoggedInDealerHandler = exports.loginDealerHandler = void 0;
const auth_service_1 = require("./auth.service");
const loginDealerHandler = async (req, res) => {
    const result = await (0, auth_service_1.loginDealerService)(req.body);
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
exports.loginDealerHandler = loginDealerHandler;
const getLoggedInDealerHandler = async (req, res) => {
    const result = await (0, auth_service_1.getLoggedInDealerService)(req.dealer.id);
    return res.status(result.status).json(result);
};
exports.getLoggedInDealerHandler = getLoggedInDealerHandler;
const logoutDealerHandler = async (_req, res) => {
    const result = await (0, auth_service_1.logoutDealerService)(res);
    return res.status(result.status).json(result);
};
exports.logoutDealerHandler = logoutDealerHandler;
