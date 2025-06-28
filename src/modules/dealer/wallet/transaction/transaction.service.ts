import { db } from "../../../../config/db"

export const getLastFiveWithdrawalsAndAdds = async (dealer_id: string) => {
  const { data, error } = await db
    .from("wallet_transactions")
    .select("*")
    .eq("dealer_id", dealer_id)
    .in("type", ["withdrawal", "recharge"])
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    }
  }

  return {
    success: true,
    message: "Last 5 withdrawals and adds fetched successfully",
    data,
  }
}
