import { Router } from "express"
import { asyncHandler } from "../../middleware/asyncHandler"
import { getAllPlans } from "../../controllers/rsaPlanController"
const router: Router = Router()

router.get("/", asyncHandler(getAllPlans))

export default router
