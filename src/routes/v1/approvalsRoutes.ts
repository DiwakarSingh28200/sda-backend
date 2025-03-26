import { Router } from "express"
import {
  getApprovals,
  getApprovalTimeline,
  updateApprovalStatus,
} from "../../controllers/approvalController"
import { asyncHandler } from "../../middleware/asyncHandler"
import { authenticateEmployee } from "../../middleware/authMeddleware"

const router: Router = Router()
router.get("/", asyncHandler(authenticateEmployee), asyncHandler(getApprovals))
router.put("/:employee_id", asyncHandler(updateApprovalStatus))
router.get("/timeline/:reference_id", asyncHandler(getApprovalTimeline))
export default router
