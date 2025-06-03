"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("./profile.controller");
const dealerAuth_middleware_1 = require("../../../middleware/dealerAuth.middleware");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", dealerAuth_middleware_1.authenticateDealer, (0, asyncHandler_1.asyncHandler)(profile_controller_1.getDealerProfileHandler));
exports.default = router;
