"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutDealerService = exports.getLoggedInDealerService = exports.loginDealerService = void 0;
const db_1 = require("../../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginDealerService = async (body) => {
    const { dealer_id, password } = body;
    const { data: dealer } = await db_1.db
        .from("dealers")
        .select("id, dealer_id, dealership_name, email, password, is_sub_dealer")
        .eq("dealer_id", dealer_id)
        .single();
    if (!dealer || !dealer.password) {
        return {
            status: 401,
            success: false,
            message: "Invalid dealer ID or password",
        };
    }
    const isMatch = await bcrypt_1.default.compare(password, dealer.password);
    if (!isMatch) {
        return {
            status: 401,
            success: false,
            message: "Invalid dealer ID or password",
        };
    }
    const token = jsonwebtoken_1.default.sign({
        id: dealer.id,
        dealer_id: dealer.dealer_id,
        is_sub_dealer: dealer.is_sub_dealer,
    }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return {
        status: 200,
        success: true,
        message: "Login successful",
        token: token,
        data: {
            id: dealer.id,
            name: dealer.dealership_name,
            dealer_id: dealer.dealer_id,
            dealership_name: dealer.dealership_name,
            role: "admin",
            email: dealer.email || null,
            type: "admin",
        },
    };
};
exports.loginDealerService = loginDealerService;
const getLoggedInDealerService = async (dealerId) => {
    const { data: dealer } = await db_1.db
        .from("dealers")
        .select("id, dealer_id, dealership_name, email, is_sub_dealer")
        .eq("id", dealerId)
        .single();
    if (!dealer) {
        return {
            status: 404,
            success: false,
            message: "Dealer not found",
        };
    }
    return {
        status: 200,
        success: true,
        message: "Dealer profile loaded",
        data: {
            id: dealer.id,
            name: dealer.dealership_name,
            dealer_id: dealer.dealer_id,
            dealership_name: dealer.dealership_name,
            role: "admin",
            email: dealer.email || null,
            type: "admin",
        },
    };
};
exports.getLoggedInDealerService = getLoggedInDealerService;
const logoutDealerService = async (res) => {
    res.clearCookie("access_token");
    return {
        status: 200,
        success: true,
        message: "Logout successful",
    };
};
exports.logoutDealerService = logoutDealerService;
