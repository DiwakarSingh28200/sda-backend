import { Router } from "express"
import dealerAuthRoutes from "../modules/dealer/auth/auth.routes"
import customerRoutes from "../modules/dealer/customers/customers.routes"
import dealerTeamAuthRoutes from "../modules/dealer/team-auth/team-auth.routes"
import salesRoutes from "../modules/dealer/sales/sales.routes"

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

// Future protected routes (wallet, rsa, team)
export default router
