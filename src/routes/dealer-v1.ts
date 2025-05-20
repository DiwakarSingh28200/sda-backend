import { Router } from "express"
import dealerAuthRoutes from "../modules/dealer/auth/auth.routes"
import customerRoutes from "../modules/dealer/customers/customers.routes"
import dealerTeamAuthRoutes from "../modules/dealer/team-auth/team-auth.routes"
import salesRoutes from "../modules/dealer/sales/sales.routes"
import dealerProfileRoutes from "../modules/dealer/profile/profile.route"
import dashboardRoutes from "../modules/dealer/dashboard/dashboard.routes"

// future: import rsaRoutes, walletRoutes, etc.

const router = Router()

// Dealer Login APIs
router.use("/auth", dealerAuthRoutes)

// Customer APIs
router.use("/customers", customerRoutes)

// Dealer Team APIs
router.use("/team", dealerTeamAuthRoutes)

// Sales APIs
router.use("/sales", salesRoutes)

// Dealer Profile APIs
router.use("/profile", dealerProfileRoutes)

// Dashboard APIs
router.use("/dashboard", dashboardRoutes)

// Future protected routes (wallet, rsa, team)
export default router
