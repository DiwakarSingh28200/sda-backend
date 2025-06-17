import { Router } from "express"
import {
  getCustomerByPhoneNumberHandler,
  getVendorsByLocationHandler,
  getVendorByVendorIDHandler,
  setVendorOnlineOfflineHandler,
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

router.get(
  "/vendors/:vendor_id",
  asyncHandler(apiKeyMiddleware),
  asyncHandler(getVendorByVendorIDHandler)
)

router.post(
  "/vendors/online-offline",
  asyncHandler(apiKeyMiddleware),
  asyncHandler(setVendorOnlineOfflineHandler)
)

export default router
