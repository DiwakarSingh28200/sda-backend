import { Router } from "express"
import {
  getDealerMetricsHandler,
  getSalesChartHandler,
  getTopEmployeesHandler,
  getPlanTypeStatsHandler,
  getEmployeeSalesStatsHandler,
  getEmployeeSalesChartHandler,
} from "./dashboard.controller"
import { authenticateDealer } from "../../../middleware/dealerAuth.middleware"
import { asyncHandler } from "../../../utils/asyncHandler"
import { authenticateDealerEmployee } from "../../../middleware/dealerEmployeeAuthMiddleware"

const router = Router()

router.get(
  "/employee-sales-stats",
  authenticateDealerEmployee,
  asyncHandler(getEmployeeSalesStatsHandler)
)

router.get(
  "/employee-sales-chart",
  authenticateDealerEmployee,
  asyncHandler(getEmployeeSalesChartHandler)
)

// All routes below require dealer login
router.use(authenticateDealer)

router.get("/metrics", asyncHandler(getDealerMetricsHandler)) // Top 4 cards
router.get("/sales-chart", asyncHandler(getSalesChartHandler)) // Sales bar chart
router.get("/top-employees", asyncHandler(getTopEmployeesHandler)) // Top 4 employees
router.get("/plan-type-stats", asyncHandler(getPlanTypeStatsHandler)) // Plan type chart

export default router
