import { Router } from "express";
import { createAuditLog, getAllAuditLogs, getAuditLogById } from "../../controllers/auditLogController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticateEmployee } from "../../middleware/authMeddleware";

const router = Router();

router.get("/",  asyncHandler(getAllAuditLogs));
router.get("/:id",  asyncHandler(getAuditLogById));
router.post("/",  asyncHandler(createAuditLog));

export default router;