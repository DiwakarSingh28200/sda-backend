"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const dealerAuth_middleware_1 = require("../../../middleware/dealerAuth.middleware");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const router = (0, express_1.Router)();
// All routes below require dealer login
router.use(dealerAuth_middleware_1.authenticateDealer);
router.get("/metrics", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getDealerMetricsHandler)); // Top 4 cards
router.get("/sales-chart", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getSalesChartHandler)); // Sales bar chart
router.get("/top-employees", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getTopEmployeesHandler)); // Top 4 employees
router.get("/plan-type-stats", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getPlanTypeStatsHandler)); // Plan type chart
exports.default = router;
