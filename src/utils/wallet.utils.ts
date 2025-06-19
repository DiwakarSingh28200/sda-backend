import { db } from "../config/db"

export const getDealerWallet = async (dealer_id: string) => {
  const { data, error } = await db
    .from("wallets")
    .select("*")
    .eq("id", dealer_id)
    .eq("is_active", true)
    .single()

  if (error || !data) {
    throw new Error("Active wallet not found")
  }

  return data
}
