import { Router } from "express";
import { updateApprovalStatus } from "../../controllers/approvalsController";
import { asyncHandler } from "../../middleware/asyncHandler";

const router: Router = Router();

router.put("/:employee_id", asyncHandler(updateApprovalStatus));

export default router;
