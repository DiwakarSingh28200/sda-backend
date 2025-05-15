import { Router } from "express"
import { createCustomerHandler } from "./customers.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealerEmployee } from "../../../middleware/dealerEmployeeAuthMiddleware"

const router = Router()

router.post("/onboard", authenticateDealerEmployee, asyncHandler(createCustomerHandler))

export default router
