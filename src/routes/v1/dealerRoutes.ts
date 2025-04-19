import { Router } from "express"
import { getAllDealers, onboardDealer } from "../../controllers/dealerController"
import { asyncHandler } from "../../middleware/asyncHandler"
const router: Router = Router()

router.post("/onboard", asyncHandler(onboardDealer))
router.get("/all", asyncHandler(getAllDealers))

export default router
