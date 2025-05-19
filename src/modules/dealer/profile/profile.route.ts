import { Router } from "express"
import { getDealerProfileHandler } from "./profile.controller"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

router.get("/", authenticateDealer, asyncHandler(getDealerProfileHandler))

export default router
