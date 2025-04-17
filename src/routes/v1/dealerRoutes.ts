import { Router } from "express"
import { onboardDealer } from "../../controllers/dealerController"
import { asyncHandler } from "../../middleware/asyncHandler"
import { authenticateEmployee } from "../../middleware/authMeddleware"
const router: Router = Router()

router.post("/onboard", asyncHandler(onboardDealer))

export default router
