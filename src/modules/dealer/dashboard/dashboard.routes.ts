import { Router } from "express"
import {
  getDealerMetricsHandler,
  getSalesChartHandler,
  getTopEmployeesHandler,
  getPlanTypeStatsHandler,
} from "./dashboard.controller"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

// All routes below require dealer login
router.use(authenticateDealer)

router.get("/metrics", asyncHandler(getDealerMetricsHandler)) // Top 4 cards
router.get("/sales-chart", asyncHandler(getSalesChartHandler)) // Sales bar chart
router.get("/top-employees", asyncHandler(getTopEmployeesHandler)) // Top 4 employees
router.get("/plan-type-stats", asyncHandler(getPlanTypeStatsHandler)) // Plan type chart

export default router
