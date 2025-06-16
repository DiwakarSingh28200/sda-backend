import { Router } from "express"
import { getDealerSalesHandler, getDelaerSalesAndComissionsHandler } from "./sales.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"
import { authenticateDealerEmployee } from "../../../middleware/dealerEmployeeAuthMiddleware"

const router = Router()

router.get("/", asyncHandler(getDealerSalesHandler))

router.get("/comissions", asyncHandler(getDelaerSalesAndComissionsHandler))

export default router
