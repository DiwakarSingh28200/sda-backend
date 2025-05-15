import { db } from "../config/db"

export async function generateDealerId({
  state,
  oemCode,
  isSubDealer = false,
  parentDealerId,
}: {
  state: string
  oemCode: string
  isSubDealer?: boolean
  parentDealerId?: string // required for sub-dealer
}): Promise<string> {
  const normalizedState = state
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const stateCode = STATE_CODE_MAP[normalizedState]
  if (!stateCode) throw new Error(`State code not found for: ${state}`)

  const prefix = `${stateCode}${oemCode.toUpperCase()}`

  if (isSubDealer) {
    if (!parentDealerId) throw new Error("Parent dealer ID is required for sub-dealer")

    // Get all sub-dealers under parent
    const { data: subs, error } = await db
      .from("dealers")
      .select("dealer_id")
      .eq("parent_dealer_id", parentDealerId)

    if (error) throw new Error("Failed to count sub-dealers")
    const subIndex = (subs?.length || 0) + 1
    return `${prefix}${String(subIndex).padStart(3, "0")}S`
  }

  // For master dealer: get count of existing dealers in this STATE+OEM
  const { data: existing, error } = await db
    .from("dealers")
    .select("dealer_id")
    .ilike("dealer_id", `${prefix}%`)

  if (error) throw new Error("Failed to fetch existing dealers")

  const nextSeq = (existing?.length || 0) + 1
  return `${prefix}${String(nextSeq).padStart(3, "0")}M`
}

// Example: dealerId is like "DLTVS005M"
export async function generateDealerEmployeeId(dealerId: string): Promise<string> {
  const base = dealerId.replace(/M$/, "") // remove trailing M if present

  // Fetch existing employees for that dealer
  const { data: employees, error } = await db
    .from("dealer_employees")
    .select("id")
    .ilike("id", `${base}E%`)

  if (error) throw new Error("Failed to fetch employee count")

  const count = employees?.length || 0
  const next = String(count + 1).padStart(3, "0")

  return `${base}E${next}` // e.g. DLTVS005E001
}

export const STATE_CODE_MAP: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Orissa: "OR",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Tripura: "TR",
  Uttarakhand: "UK",
  "Uttar Pradesh": "UP",
  "West Bengal": "WB",
  "Andaman and Nicobar Islands": "AN",
  Chandigarh: "CH",
  "Dadra and Nagar Haveli": "DH",
  "Daman and Diu": "DD",
  Delhi: "DL",
  Lakshadweep: "LD",
  Pondicherry: "PY",
}
