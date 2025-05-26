import { db } from "../config/db"
import { VendorOnboardingPayload } from "../types/vendor.type"
import bcrypt from "bcrypt"
import { generateVendorId } from "../utils/idGenerators"

export const createVendor = async (input: VendorOnboardingPayload, createdBy: string) => {
  const { vendor, services, operatingAreas, pricing, operations, contacts, documents, bank_info } =
    input

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

  // Insert bank info
  const { error: bankInfoError } = await db
    .from("vendor_bank_info")
    .insert([{ ...bank_info, vendor_id }])
  if (bankInfoError) throw bankInfoError

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

export const getVendorById = async (id: string) => {
  const { data, error } = await db
    .from("vendors")
    .select(
      `
      *,
      documents:vendor_documents(*),
      contacts:vendor_contacts(*),
      operating_areas:vendor_operating_areas(*),
      operations:vendor_operations(*),
      pricing:vendor_pricing(*),
      services:vendor_services(*)
    `
    )
    .eq("vendor_id", id)
    .single()

  if (error) throw error
  return {
    vendor: {
      id: data.id,
      type: data.type,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      primary_contact_name: data.primary_contact_name,
      primary_contact_number: data.primary_contact_number,
      primary_email: data.primary_email,
      status: data.status,
      location_url: data.location_url,
      vendor_id: data.vendor_id,
      login_enabled: data.login_enabled,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
    },
    documents: {
      gst_number: data.documents[0]?.gst_number,
      pan_number: data.documents[0]?.pan_number,
      pan_card: data.documents[0]?.pan_card_file_path,
      address_proof: data.documents[0]?.address_proof_file_path,
      gst_certificate: data.documents[0]?.gst_certificate_file_path,
      cancelled_cheque: data.documents[0]?.cancelled_cheque_file_path,
    },
    contacts: {
      finance: {
        name: data.contacts[0]?.finance_contact_name,
        email: data.contacts[0]?.finance_contact_email,
        number: data.contacts[0]?.finance_contact_number,
      },
      support: {
        email: data.contacts[0]?.support_contact_email,
        number: data.contacts[0]?.support_contact_number,
      },
      preferences: {
        sms: data.contacts[0]?.prefers_sms,
        email: data.contacts[0]?.prefers_email,
      },
    },
    coverage: {
      operating_areas: data.operating_areas.map((area) => ({
        city: area.city,
        region: area.region,
        location: area.location,
        coordinates: {
          latitude: area.latitude,
          longitude: area.longitude,
        },
      })),
    },
    operations: {
      availability: {
        is_24x7: data.operations[0]?.is_24x7,
        time_start: data.operations[0]?.time_start,
        time_end: data.operations[0]?.time_end,
        available_days: data.operations[0]?.available_days,
      },
      service: {
        coverage_km: data.operations[0]?.coverage_km,
        response_time: data.operations[0]?.response_time,
        description: data.operations[0]?.service_description,
        estimated_arrival_minutes: data.operations[0]?.estimated_arrival_time_minutes,
        certifications_file: data.operations[0]?.certifications_file_path,
      },
    },
    pricing: {
      base: {
        per_service: data.pricing[0]?.price_per_service,
        per_additional_km: data.pricing[0]?.price_per_additional_km,
        repair_on_site: data.pricing[0]?.repair_on_site_price,
      },
      additional: {
        night_charges: data.pricing[0]?.night_charges,
        night_charges_towing: data.pricing[0]?.night_charges_towing,
      },
      notes: data.pricing[0]?.notes,
      price_list_file: data.pricing[0]?.price_list_file_path,
    },
    services: data.services.map((service) => ({
      category: service.category,
      repair_on_site: service.repair_on_site,
    })),
  }
}

export const getAllVendors = async () => {
  const { data, error } = await db
    .from("vendors")
    .select(
      `
      id,
      type,
      name, 
      address,
      city,
      state,
      pincode,
      primary_contact_name,
      primary_contact_number,
      primary_email,
      status,
      location_url,
      vendor_id,
      created_at
    `
    )
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}
