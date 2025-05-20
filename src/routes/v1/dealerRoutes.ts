import { Router } from "express"
import { getAllDealers, onboardDealerHandler } from "../../controllers/dealerController"
import { asyncHandler } from "../../middleware/asyncHandler"
const router: Router = Router()

router.post("/onboard", asyncHandler(onboardDealerHandler))
router.get("/all", asyncHandler(getAllDealers))

export default router
