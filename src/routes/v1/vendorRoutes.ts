import express from "express"
import {
  handleCreateVendor,
  handleGetAllVendors,
  handleGetVendorById,
} from "../../controllers/vendorController"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = express.Router()

router.get("/", asyncHandler(handleGetAllVendors))
router.get("/:id", asyncHandler(handleGetVendorById))
router.post("/onboard", asyncHandler(handleCreateVendor))

export default router
