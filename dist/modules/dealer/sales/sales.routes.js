"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = require("./sales.controller");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const dealerAuth_middleware_1 = require("../../../middleware/dealerAuth.middleware");
const dealerEmployeeAuthMiddleware_1 = require("../../../middleware/dealerEmployeeAuthMiddleware");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    // ✅ Accept either middleware
    (0, dealerAuth_middleware_1.authenticateDealer)(req, res, (err) => {
        if (!err && req.dealer)
            return next();
        (0, dealerEmployeeAuthMiddleware_1.authenticateDealerEmployee)(req, res, next);
    });
}, (0, asyncHandler_1.asyncHandler)(sales_controller_1.getDealerSalesHandler));
exports.default = router;
