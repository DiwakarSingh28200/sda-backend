import { Router } from "express"
import { getMyNotifications, markAsRead } from "../../controllers/notificationController"
import { authenticateEmployee } from "../../middleware/authMeddleware"
import { asyncHandler } from "../../middleware/asyncHandler"

const router = Router()

router.get("/", asyncHandler(authenticateEmployee), asyncHandler(getMyNotifications))
router.put("/:id/read", asyncHandler(authenticateEmployee), asyncHandler(markAsRead))

export default router
