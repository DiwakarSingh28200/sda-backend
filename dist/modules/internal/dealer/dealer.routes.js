"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dealer_controller_1 = require("./dealer.controller");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post("/onboard", (0, asyncHandler_1.asyncHandler)(dealer_controller_1.onboardDealerHandler));
router.get("/all", (0, asyncHandler_1.asyncHandler)(dealer_controller_1.getAllDealersHandler));
exports.default = router;
