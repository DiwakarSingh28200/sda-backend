"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = require("./sales.controller");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(sales_controller_1.getDealerSalesHandler));
exports.default = router;
