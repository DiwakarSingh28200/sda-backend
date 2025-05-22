import { Router } from "express"
import {
  getAllDealers,
  onboardDealerHandler,
  getDealerByDealerID,
  getDealerProfileById,
  getSubDealerLeads,
} from "../../controllers/dealerController"
import { asyncHandler } from "../../middleware/asyncHandler"
const router: Router = Router()
router.get("/sub-dealers-leads", asyncHandler(getSubDealerLeads))
router.post("/onboard", asyncHandler(onboardDealerHandler))
router.get("/all", asyncHandler(getAllDealers))
router.get("/:dealer_id", asyncHandler(getDealerByDealerID))
router.get("/profile/:dealer_id", asyncHandler(getDealerProfileById))

export default router
