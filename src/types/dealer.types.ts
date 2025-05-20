import { Database } from "./supabase"

export type Dealer = Database["public"]["Tables"]["dealers"]["Insert"]
export type FinanceInfo = Database["public"]["Tables"]["dealer_finance_info"]["Insert"]
export type OEM = Database["public"]["Tables"]["dealer_oems"]["Insert"]
export type Employee = Database["public"]["Tables"]["dealer_employees"]["Insert"]
export type Service = Database["public"]["Tables"]["dealer_services"]["Insert"]
export type Documents = Database["public"]["Tables"]["dealer_documents"]["Insert"]
export type SubDealership = Database["public"]["Tables"]["dealer_sub_dealerships"]["Insert"]

export interface DealerOnboardingPayload {
  dealer: Omit<
    Dealer,
    "id" | "created_by" | "password" | "login_enabled" | "created_at" | "dealer_id"
  >

  finance_info: Omit<FinanceInfo, "id" | "dealer_id">

  documents: Omit<Documents, "id" | "dealer_id" | "additional_docs">

  employees?: Array<
    Omit<
      Employee,
      "id" | "dealer_id" | "password" | "employee_id" | "login_enabled" | "created_at"
    >
  >

  services?: Array<Omit<Service, "id" | "dealer_id">>

  sub_dealerships?: Array<Omit<SubDealership, "id" | "dealer_id" | "created_by" | "created_at">>
}
