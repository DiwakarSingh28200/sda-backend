import { Database } from "../../../types/supabase"

export type Vendor = Database["public"]["Tables"]["vendors"]["Insert"]
export type VendorService = Database["public"]["Tables"]["vendor_services"]["Insert"]
export type VendorOperatingArea = Database["public"]["Tables"]["vendor_operating_areas"]["Insert"]
export type VendorContacts = Database["public"]["Tables"]["vendor_contacts"]["Insert"]
export type VendorDocuments = Database["public"]["Tables"]["vendor_documents"]["Insert"]
export type VendorBankInfo = Database["public"]["Tables"]["vendor_bank_info"]["Insert"]

export interface VendorOnboardingPayload {
  vendor: Omit<Vendor, "id" | "created_by" | "created_at">
  services: Omit<VendorService, "id" | "created_by" | "created_at">[]
  operatingAreas: Omit<VendorOperatingArea, "id" | "created_by" | "created_at">[]
  bankInfo: Omit<VendorBankInfo, "id" | "vendor_id" | "created_by" | "created_at">
  contacts: Omit<VendorContacts, "id" | "vendor_id" | "created_by" | "created_at">
  documents: Omit<VendorDocuments, "id" | "vendor_id" | "created_by" | "created_at">
}
