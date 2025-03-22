import { Router } from "express";
import { getApprovals, updateApprovalStatus } from "../../controllers/approvalsController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticateEmployee } from "../../middleware/authMeddleware";

const router: Router = Router();
router.get("/", asyncHandler(authenticateEmployee),asyncHandler(getApprovals));
router.put("/:employee_id", asyncHandler(updateApprovalStatus));

export default router;
