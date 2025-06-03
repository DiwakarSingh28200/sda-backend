"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("./employee.controller");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const dealerAuth_middleware_1 = require("../../../middleware/dealerAuth.middleware");
const router = (0, express_1.Router)();
// /employees/
router.get("/:dealer_id", (0, asyncHandler_1.asyncHandler)(employee_controller_1.getDealerEmployeeByDealerIDHandler));
router.get("/:dealer_id/employees", (0, asyncHandler_1.asyncHandler)(employee_controller_1.getDealerEmployeeByDealerIDHandler));
router.post("/add", dealerAuth_middleware_1.authenticateDealer, (0, asyncHandler_1.asyncHandler)(employee_controller_1.addDealerEmployeeHandler));
router.put("/update/:employee_id", dealerAuth_middleware_1.authenticateDealer, (0, asyncHandler_1.asyncHandler)(employee_controller_1.updateDealerEmployeeHandler));
router.delete("/delete/:employee_id", dealerAuth_middleware_1.authenticateDealer, (0, asyncHandler_1.asyncHandler)(employee_controller_1.deleteDealerEmployeeHandler));
exports.default = router;
