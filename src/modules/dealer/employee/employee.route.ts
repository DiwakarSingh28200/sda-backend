import { Router } from "express"
import { getDealerEmployeeByDealerIDHandler } from "./employee.controller"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

router.get("/:dealer_id", asyncHandler(getDealerEmployeeByDealerIDHandler))

export default router
