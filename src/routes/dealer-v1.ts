import { Router } from "express"
import dealerAuthRoutes from "../modules/dealer/auth/auth.routes"
import customerRoutes from "../modules/dealer/customers/customers.routes"
import dealerTeamAuthRoutes from "../modules/dealer/team-auth/team-auth.routes"
import salesRoutes from "../modules/dealer/sales/sales.routes"
import dealerProfileRoutes from "../modules/dealer/profile/profile.route"
import dashboardRoutes from "../modules/dealer/dashboard/dashboard.routes"
import dealerEmployeeRoutes from "../modules/dealer/employee/employee.route"
import bikeModelRoutes from "../modules/dealer/bike-models/bike.router"
import walletRoutes from "../modules/dealer/wallet/wallet.routes"
import invoiceRoutes from "../modules/dealer/invoice/invoice.routes"
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

// Dealer Employee APIs
router.use("/employees", dealerEmployeeRoutes)

// Bike Models APIs
router.use("/bike-models", bikeModelRoutes)

// Wallet APIs
router.use("/wallet", walletRoutes)

// Invoice APIs
router.use("/invoice", invoiceRoutes)

export default router
