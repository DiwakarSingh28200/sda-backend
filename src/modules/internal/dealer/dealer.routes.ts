import { Router } from "express"
import {
  onboardDealerHandler,
  getAllDealersHandler,
  getSubDealerLeads,
  getDealerByDealerID,
  getDealerProfileById,
} from "./dealer.controller"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

router.post("/onboard", asyncHandler(onboardDealerHandler))
router.get("/all", asyncHandler(getAllDealersHandler))
router.get("/sub-dealers-leads", asyncHandler(getSubDealerLeads))
router.get("/:dealer_id", asyncHandler(getDealerByDealerID))
router.get("/profile/:dealer_id", asyncHandler(getDealerProfileById))
export default router
