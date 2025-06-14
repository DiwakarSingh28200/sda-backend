import { Database } from "../../../types/supabase"

export type Dealer = Database["public"]["Tables"]["dealers"]["Insert"]
export type FinanceInfo = Database["public"]["Tables"]["dealer_finance_info"]["Insert"]
export type Employee = Database["public"]["Tables"]["dealer_employees"]["Insert"]
export type Service = Database["public"]["Tables"]["dealer_services"]["Insert"]
export type Documents = Database["public"]["Tables"]["dealer_documents"]["Insert"]
export type SubDealership = Database["public"]["Tables"]["dealer_sub_dealerships"]["Insert"]
export type WalletConfig = Database["public"]["Tables"]["wallet_config"]["Insert"]

export interface DealerOnboardingPayload {
  dealer: Omit<
    Dealer,
    "id" | "created_by" | "password" | "login_enabled" | "created_at" | "dealer_id"
  >

  finance_info: Omit<FinanceInfo, "id">

  documents: Omit<Documents, "id" | "additional_docs">

  employees?: Array<
    Omit<
      Employee,
      "id" | "dealer_id" | "password" | "employee_id" | "login_enabled" | "created_at"
    >
  >

  services?: Array<Omit<Service, "id">>

  sub_dealerships?: Array<Omit<SubDealership, "id" | "created_by" | "created_at">>

  wallet_config?: Omit<WalletConfig, "id" | "created_by" | "created_at">
}
