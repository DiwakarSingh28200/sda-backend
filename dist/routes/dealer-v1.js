"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/dealer/auth/auth.routes"));
const customers_routes_1 = __importDefault(require("../modules/dealer/customers/customers.routes"));
const team_auth_routes_1 = __importDefault(require("../modules/dealer/team-auth/team-auth.routes"));
const sales_routes_1 = __importDefault(require("../modules/dealer/sales/sales.routes"));
// future: import rsaRoutes, walletRoutes, etc.
const router = (0, express_1.Router)();
// Dealer Login APIs
router.use("/auth", auth_routes_1.default);
// Customer APIs
router.use("/customers", customers_routes_1.default);
// Dealer Team APIs
router.use("/team", team_auth_routes_1.default);
// Sales APIs
router.use("/sales", sales_routes_1.default);
// Future protected routes (wallet, rsa, team)
exports.default = router;
