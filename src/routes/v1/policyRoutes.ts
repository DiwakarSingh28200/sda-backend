import { Router } from "express"
import { downloadPolicyPdfHandler } from "../../controllers/policyController"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = Router()
router.get("/:policy_number/pdf", asyncHandler(downloadPolicyPdfHandler))
export default router
