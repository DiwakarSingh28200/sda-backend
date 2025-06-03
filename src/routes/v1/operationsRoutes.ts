import { Router } from "express"
import {
  getCustomerByPhoneNumberHandler,
  getVendorsByLocationHandler,
} from "../../controllers/operationsController"
import { asyncHandler } from "../../middleware/asyncHandler"
import { apiKeyMiddleware } from "../../middleware/apiKeyMiddleware"

const router = Router()

router.get(
  "/customers/:phoneNumber",
  asyncHandler(apiKeyMiddleware),
  asyncHandler(getCustomerByPhoneNumberHandler)
)
router.get(
  "/vendors/nearby",
  asyncHandler(apiKeyMiddleware),
  asyncHandler(getVendorsByLocationHandler)
)

export default router
