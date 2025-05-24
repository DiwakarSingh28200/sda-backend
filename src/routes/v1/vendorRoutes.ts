import express from "express"
import { handleCreateVendor } from "../../controllers/vendorController"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = express.Router()

router.post("/onboard", asyncHandler(handleCreateVendor))

export default router
