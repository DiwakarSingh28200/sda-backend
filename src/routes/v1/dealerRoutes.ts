import { Router } from "express"
import {
  getAllDealers,
  onboardDealerHandler,
  getDealerByDealerID,
  getDealerProfileById,
} from "../../controllers/dealerController"
import { asyncHandler } from "../../middleware/asyncHandler"
const router: Router = Router()

router.post("/onboard", asyncHandler(onboardDealerHandler))
router.get("/all", asyncHandler(getAllDealers))
router.get("/:dealer_id", asyncHandler(getDealerByDealerID))
router.get("/profile/:dealer_id", asyncHandler(getDealerProfileById))

export default router
