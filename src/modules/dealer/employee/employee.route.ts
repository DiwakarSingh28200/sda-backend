import { Router } from "express"
import {
  addDealerEmployeeHandler,
  deleteDealerEmployeeHandler,
  getDealerEmployeeByDealerIDHandler,
  resetDealerEmployeePasswordHandler,
  updateDealerEmployeeHandler,
} from "./employee.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"

const router = Router()

// /employees/

router.get("/:dealer_id", asyncHandler(getDealerEmployeeByDealerIDHandler))
router.get("/:dealer_id/employees", asyncHandler(getDealerEmployeeByDealerIDHandler))
router.post("/add", authenticateDealer, asyncHandler(addDealerEmployeeHandler))
router.put("/update/:employee_id", authenticateDealer, asyncHandler(updateDealerEmployeeHandler))
router.delete(
  "/delete/:employee_id",
  authenticateDealer,
  asyncHandler(deleteDealerEmployeeHandler)
)
router.post(
  "/reset-password",
  authenticateDealer,
  asyncHandler(resetDealerEmployeePasswordHandler)
)

export default router
