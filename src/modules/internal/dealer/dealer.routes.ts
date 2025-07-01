import { Router } from "express"
import {
  onboardDealerHandler,
  getAllDealersHandler,
  getSubDealerLeads,
  getDealerByDealerID,
  getDealerProfileById,
  getDealerOnboardStatController,
} from "./dealer.controller"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateEmployee } from "../../../middleware/auth.middleware"

const router = Router()

router.get("/dashboard-stats", authenticateEmployee, asyncHandler(getDealerOnboardStatController))
router.post("/onboard", authenticateEmployee, asyncHandler(onboardDealerHandler))
router.get("/all", authenticateEmployee, asyncHandler(getAllDealersHandler))
router.get("/sub-dealers-leads", asyncHandler(getSubDealerLeads))
router.get("/:dealer_id", asyncHandler(getDealerByDealerID))
router.get("/profile/:dealer_id", asyncHandler(getDealerProfileById))
export default router
