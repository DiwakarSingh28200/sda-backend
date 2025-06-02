import { db } from "../../../config/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Response } from "express"
import { DealerLoginInput } from "./auth.types"

export const loginDealerService = async (body: DealerLoginInput) => {
  const { dealer_id, password } = body

  console.log(dealer_id, password)

  const { data: dealer } = await db
    .from("dealers")
    .select("id, dealer_id, dealership_name, email, password, is_sub_dealer, oem")
    .eq("dealer_id", dealer_id)
    .single()

  if (!dealer || !dealer.password) {
    return {
      status: 401,
      success: false,
      message: "Invalid dealer ID or password",
    }
  }

  const isMatch = await bcrypt.compare(password, dealer.password)
  if (!isMatch) {
    return {
      status: 401,
      success: false,
      message: "Invalid dealer ID or password",
    }
  }

  // lets find dealer has any sub dealer
  const { data: subDealer } = await db
    .from("dealers")
    .select("id, dealer_id, dealership_name, email, password, is_sub_dealer, oem")
    .eq("parent_dealer_id", dealer.id)

  const token = jwt.sign(
    {
      id: dealer.id,
      dealer_id: dealer.dealer_id,
      is_sub_dealer: dealer.is_sub_dealer,
      roles: ["admin"],
      permissions: ["*"],
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  )

  const filteredSubDealer =
    subDealer &&
    subDealer.map((dealer) => ({
      id: dealer.id,
      name: dealer.dealership_name,
      dealer_id: dealer.dealer_id,
      role: "sub_dealer",
      email: dealer.email,
      type: "sub_dealer",
      oem: dealer.oem,
    }))

  return {
    status: 200,
    success: true,
    message: "Login successful",
    token: token,
    data: {
      user: {
        id: dealer.id,
        name: dealer.dealership_name,
        dealer_id: dealer.dealer_id,
        dealership_name: dealer.dealership_name,
        role: "admin",
        email: dealer.email || null,
        type: "admin",
        oem: dealer.oem,
      },
      dealer_id: dealer.id,
      sub_dealers: filteredSubDealer,
      roles: ["admin"],
      permissions: ["*"],
    },
  }
}

export const getLoggedInDealerService = async (dealerId: string) => {
  const { data: dealer } = await db
    .from("dealers")
    .select("id, dealer_id, dealership_name, email, is_sub_dealer, oem")
    .eq("id", dealerId)
    .single()

  if (!dealer) {
    return {
      status: 404,
      success: false,
      message: "Dealer not found",
    }
  }

  // lets find dealer has any sub dealer
  const { data: subDealer } = await db
    .from("dealers")
    .select("id, dealer_id, dealership_name, email, is_sub_dealer, oem")
    .eq("parent_dealer_id", dealer.id)

  const filteredSubDealer =
    subDealer &&
    subDealer.map((dealer) => ({
      id: dealer.id,
      name: dealer.dealership_name,
      dealer_id: dealer.dealer_id,
      role: "sub_dealer",
      email: dealer.email,
      type: "sub_dealer",
      oem: dealer.oem,
    }))

  return {
    status: 200,
    success: true,
    message: "Dealer profile loaded",
    data: {
      user: {
        id: dealer.id,
        name: dealer.dealership_name,
        dealer_id: dealer.dealer_id,
        dealership_name: dealer.dealership_name,
        role: "admin",
        email: dealer.email || null,
        type: "admin",
        oem: dealer.oem,
      },
      dealer_id: dealer.id,
      sub_dealers: filteredSubDealer,
      roles: ["admin"],
      permissions: ["*"],
    },
  }
}

export const logoutDealerService = async (res: Response) => {
  res.clearCookie("dealer_token")
  return {
    status: 200,
    success: true,
    message: "Logout successful",
  }
}
