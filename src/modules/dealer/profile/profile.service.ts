import { db } from "../../../config/db"

export const getDealerProfileService = async (dealer_id: string) => {
  // Step 1: Get actual UUID (id) from dealer_id
  const { data: dealer, error } = await db
    .from("dealers")
    .select("*")
    .eq("dealer_id", dealer_id)
    .single()

  if (error || !dealer) throw new Error("Dealer not found")

  const dealerID = dealer.id

  // ⛔️ Remove sensitive fields
  const { password, ...safeDealer } = dealer

  // Step 2: Fetch all other data using dealerID
  const [documents, finance_info, sub_dealerships, employees, services] = await Promise.all([
    db.from("dealer_documents").select("*").eq("dealer_id", dealerID).single(),
    db.from("dealer_finance_info").select("*").eq("dealer_id", dealerID).single(),
    db
      .from("dealers")
      .select(
        "id, dealer_id, dealership_name, registered_address, city,state, pincode, oems, owner_name, owner_contact, owner_email, vehicle_types, created_by"
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
    documents: documents.data,
    finance_info: finance_info.data,
    oem: safeDealer.oem,
    sub_dealerships: sub_dealerships.data,
    employees: employees.data,
    services: services.data,
  }
}
