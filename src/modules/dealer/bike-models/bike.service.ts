import { db } from "../../../config/db"

export const getBikeModelsByCompanyName = async (brand: string) => {
  const { data, error } = await db.from("bike_models").select("*").eq("brand", brand)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
