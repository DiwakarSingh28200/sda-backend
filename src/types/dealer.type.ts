import { Database } from "../types/supabase"

type Dealer = Database["public"]["Tables"]["dealers"]["Insert"]
type FinanceInfo = Database["public"]["Tables"]["dealer_finance_info"]["Insert"]
type OEM = Database["public"]["Tables"]["dealer_oems"]["Insert"]
type Employee = Database["public"]["Tables"]["dealer_employees"]["Insert"]
type Service = Database["public"]["Tables"]["dealer_services"]["Insert"]
type SubDealership = Database["public"]["Tables"]["dealer_sub_dealerships"]["Insert"]
type Documents = Database["public"]["Tables"]["dealer_documents"]["Insert"]

export interface DealerOnboardingPayload {
  dealer: Omit<Dealer, "id" | "created_by" | "username" | "password" | "created_at">
  finance_info: Omit<FinanceInfo, "id" | "dealer_id"> & {
    cancelled_cheque_file: File
  }

  documents: Omit<Documents, "additional_docs">

  oems: Array<Omit<OEM, "id" | "dealer_id">>

  employees?: Array<
    Omit<Employee, "id" | "dealer_id" | "password" | "username" | "login_enabled" | "created_at">
  >

  services?: Array<Omit<Service, "id" | "dealer_id">>

  sub_dealerships?: Array<Omit<SubDealership, "id" | "dealer_id">>
}
