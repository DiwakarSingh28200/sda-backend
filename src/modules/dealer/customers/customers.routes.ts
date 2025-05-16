import { Router } from "express"
import {
  createCustomerHandler,
  getAllCustomersHandler,
} from "./customers.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealerEmployee } from "../../../middleware/dealerEmployeeAuthMiddleware"

const router = Router()

router.post(
  "/onboard",
  authenticateDealerEmployee,
  asyncHandler(createCustomerHandler)
)
router.get(
  "/all",
  authenticateDealerEmployee,
  asyncHandler(getAllCustomersHandler)
)

export default router
