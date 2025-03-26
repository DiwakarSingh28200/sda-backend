import express from "express"
import {
  getApprovalInstances,
  getApprovalTimeline,
  getSingleApprovalInstance,
} from "../../controllers/approvalInstanceController"
import { authenticateEmployee } from "../../middleware/authMeddleware"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = express.Router()

router.get("/", asyncHandler(authenticateEmployee), asyncHandler(getApprovalInstances))
router.get("/:id", asyncHandler(authenticateEmployee), asyncHandler(getSingleApprovalInstance))
router.get("/:id/timeline", asyncHandler(authenticateEmployee), asyncHandler(getApprovalTimeline))

export default router
