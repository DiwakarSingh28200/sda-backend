import { Router } from "express"
import dealerAuthRoutes from "../modules/dealer/auth/auth.routes"
// future: import rsaRoutes, walletRoutes, etc.

const router = Router()

// Dealer Login APIs
router.use("/auth", dealerAuthRoutes)

// Future protected routes (wallet, rsa, team)
export default router
