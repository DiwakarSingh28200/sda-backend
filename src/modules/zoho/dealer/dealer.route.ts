import { Router } from "express"
import {
  getAllPendingDealersController,
  approveDealerController,
  rejectDealerController,
} from "./dealer.controller"

const router = Router()

router.get("/pending", getAllPendingDealersController)
router.post("/:id/approve", approveDealerController)
router.post("/:id/reject", rejectDealerController)

export default router
