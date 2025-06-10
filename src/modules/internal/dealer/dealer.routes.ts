import { Router } from "express"
import { onboardDealerHandler, getAllDealersHandler, getSubDealerLeads } from "./dealer.controller"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

router.post("/onboard", asyncHandler(onboardDealerHandler))
router.get("/all", asyncHandler(getAllDealersHandler))
router.get("/sub-dealers-leads", asyncHandler(getSubDealerLeads))

export default router
