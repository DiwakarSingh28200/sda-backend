import { db } from "../config/db"
import { VendorOnboardingPayload } from "../types/vendor.type"
import bcrypt from "bcrypt"
import { generateVendorId } from "../utils/idGenerators"

export const createVendor = async (input: VendorOnboardingPayload, createdBy: string) => {
  const { vendor, services, operatingAreas, pricing, operations, contacts, documents } = input

  // check if vendor already exists
  const { data: existingVendor } = await db
    .from("vendors")
    .select("id")
    .ilike("name", vendor.name!)
    .eq("city", vendor.city!)
    .eq("state", vendor.state!)
    .single()

  if (existingVendor) {
    throw new Error("Vendor already exists")
  }

  const vendorId = await generateVendorId({ state: vendor.state! })

  const tempPassword = "Vendor@1234"
  const hashedPassword = await bcrypt.hash(tempPassword, 10)

  // Insert into vendors
  const { data: vendorInsert, error: vendorError } = await db
    .from("vendors")
    .insert([
      {
        ...vendor,
        vendor_id: vendorId,
        password: hashedPassword,
        login_enabled: true,
        created_by: createdBy,
      },
    ])
    .select("id")
    .single()

  if (vendorError) throw vendorError
  const vendor_id = vendorInsert.id

  if (!vendor_id) throw new Error("Failed to create vendor")

  // Insert services
  if (services.length) {
    const servicePayload = services.map((s) => ({
      vendor_id,
      category: s.category,
      repair_on_site: s.repair_on_site,
    }))
    const { error: serviceError } = await db.from("vendor_services").insert(servicePayload)
    if (serviceError) throw serviceError
  }

  // Insert operating areas
  if (operatingAreas.length) {
    const areaPayload = operatingAreas.map((a) => ({
      vendor_id,
      region: a.region,
      city: a.city,
      latitude: a.latitude,
      longitude: a.longitude,
      location: `SRID=4326;POINT(${a.longitude} ${a.latitude})`,
    }))
    const { error: areaError } = await db.from("vendor_operating_areas").insert(areaPayload)
    if (areaError) throw areaError
  }

  // Insert pricing
  const { error: pricingError } = await db.from("vendor_pricing").insert([
    {
      price_per_service: pricing.price_per_service,
      price_per_additional_km: pricing.price_per_additional_km,
      night_charges: pricing.night_charges,
      night_charges_towing: pricing.night_charges_towing,
      repair_on_site_price: pricing.repair_on_site_price,
      price_list_file_path: pricing.price_list_file_path,
      notes: pricing.notes,
      vendor_id,
    },
  ])
  if (pricingError) throw pricingError

  // Insert operations
  const { error: opsError } = await db
    .from("vendor_operations")
    .insert([{ ...operations, vendor_id }])
  if (opsError) throw opsError

  // Insert contacts
  const { error: contactError } = await db
    .from("vendor_contacts")
    .insert([{ ...contacts, vendor_id }])
  if (contactError) throw contactError

  // Insert documents
  const { error: docError } = await db
    .from("vendor_documents")
    .insert([{ ...documents, vendor_id }])
  if (docError) throw docError

  await db.from("audit_logs").insert([
    {
      entity_type: "vendor",
      reference_id: vendor_id,
      action: "created",
      performed_by: createdBy,
      remarks: `Vendor '${vendor.name}' (${vendor.city}) onboarded by employee ${createdBy}`,
    },
  ])

  return { vendor_id }
}
