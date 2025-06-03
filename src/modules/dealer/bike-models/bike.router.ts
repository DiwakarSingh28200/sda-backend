import { Router } from "express"
import { getBikeModelsByCompanyNameController } from "./bike.controller"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

router.get("/", asyncHandler(getBikeModelsByCompanyNameController))

export default router
