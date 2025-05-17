"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/internal/auth/auth.routes"));
// import dealerRoutes from "@/modules/dealer/dealer.routes";
// import { authenticateEmployee } from "@/middleware/authMiddleware";
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default); // public routes
// router.use(authenticateEmployee); // protect below
// router.use("/dealers", dealerRoutes);
exports.default = router;
