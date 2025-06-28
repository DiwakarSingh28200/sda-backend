import { db } from "../../../config/db"

export const getAllPendingDealersService = async () => {
  const { data: dealers, error } = await db.from("dealers").select("*").eq("status", "pending")

  if (error || !dealers) throw new Error("Pending dealers not found")

  const results = await Promise.all(
    dealers.map(async (dealer) => {
      const dealerID = dealer.id

      // Step 1: Remove sensitive fields
      const { password, ...safeDealer } = dealer

      // Step 2: Fetch related data
      const [documents, finance_info, sub_dealerships, employees, services] = await Promise.all([
        db.from("dealer_documents").select("*").eq("dealer_id", dealerID).maybeSingle(),
        db.from("dealer_finance_info").select("*").eq("dealer_id", dealerID).maybeSingle(),
        db
          .from("dealers")
          .select(
            "id, dealer_id, dealership_name, registered_address, city, state, pincode, oems, owner_name, owner_contact, owner_email, vehicle_types, created_by"
          )
          .eq("parent_dealer_id", dealerID),
        db
          .from("dealer_employees")
          .select("name, role, contact_number, email")
          .eq("dealer_id", dealerID),
        db.from("dealer_services").select("*").eq("dealer_id", dealerID),
      ])

      return {
        dealer: safeDealer,
        documents: documents.data ?? null,
        finance_info: finance_info.data ?? null,
        oem: safeDealer.oem ?? [],
        sub_dealerships: sub_dealerships.data ?? [],
        employees: employees.data ?? [],
        services: services.data ?? [],
      }
    })
  )

  return results
}

export const approveDealerService = async (dealerId: string) => {
  const { data: dealer, error } = await db
    .from("dealers")
    .update({ status: "approved", login_enabled: true })
    .eq("id", dealerId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: true,
    message: "Dealer approved successfully",
    data: dealer,
  }
}

export const rejectDealerService = async (dealerId: string) => {
  const { data: dealer, error } = await db
    .from("dealers")
    .update({ status: "rejected" })
    .eq("id", dealerId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: true,
    message: "Dealer rejected successfully",
    data: dealer,
  }
}
