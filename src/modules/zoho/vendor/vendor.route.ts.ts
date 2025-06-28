import { Router } from "express"
import {
  getAllPendingVendorsController,
  approveVendorController,
  rejectVendorController,
} from "./vendor.controller"

const router = Router()

router.get("/pending", getAllPendingVendorsController)
router.post("/:id/approve", approveVendorController)
router.post("/:id/reject", rejectVendorController)

export default router
