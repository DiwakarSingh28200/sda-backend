import { Router } from "express"
import { handleCreateVendor, handleGetVendorById, handleGetAllVendors } from "./vendor.controller"
import { authenticateEmployee } from "../../../middleware/auth.middleware"
import { asyncHandler } from "../../../utils/asyncHandler"
const router = Router()

router.get("/", authenticateEmployee, asyncHandler(handleGetAllVendors))
router.get("/profile/:id", asyncHandler(handleGetVendorById))
router.post("/onboard", authenticateEmployee, asyncHandler(handleCreateVendor))

export default router
