import { Router } from "express"
import { createCustomerHandler } from "./customers.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"

const router = Router()

router.post("/onboard", authenticateDealer, asyncHandler(createCustomerHandler))

export default router
