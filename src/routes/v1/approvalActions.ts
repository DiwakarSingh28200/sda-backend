import express from "express"
import {
  handleApprovalAction,
  resubmitApprovalStep,
} from "../../controllers/approvalActionController"
import { authenticateEmployee } from "../../middleware/authMeddleware"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = express.Router()

router.put("/:id/action", asyncHandler(authenticateEmployee), asyncHandler(handleApprovalAction))
router.put("/:id/resubmit", asyncHandler(authenticateEmployee), asyncHandler(resubmitApprovalStep))

export default router
