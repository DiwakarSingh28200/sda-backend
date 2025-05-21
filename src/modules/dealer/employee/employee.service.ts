import { db } from "../../../config/db"

export const getDealerEmployeeByDealerIDService = async (dealer_id: string) => {
  const { data, error } = await db
    .from("dealer_employees")
    .select("id, employee_id, name, email, role, contact_number, created_at")
    .eq("dealer_id", dealer_id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
