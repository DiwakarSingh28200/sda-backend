import { Request, Response } from "express"
import { errorResponse, successResponse } from "../utils/apiResponse"
import { getCustomerByPhoneNumber } from "../services/customerService"
import { getVendorsByLocation } from "../services/vendorService"
import { getUrlData } from "../utils/coordinates"

export const getCustomerByPhoneNumberHandler = async (req: Request, res: Response) => {
  const { phoneNumber } = req.params as { phoneNumber: string }
  const customer = await getCustomerByPhoneNumber(phoneNumber)
  if (customer !== null) {
    return res.status(200).json(successResponse("Customer fetched successfully", customer))
  } else {
    return res.status(404).json(errorResponse("Customer not found"))
  }
}

export const getVendorsByLocationHandler = async (req: Request, res: Response) => {
  try {
    const {
      lat: latStr,
      lng: lngStr,
      radius_km: radiusStr,
      location_url,
    } = req.query as {
      lat?: string
      lng?: string
      radius_km?: string
      location_url?: string
    }

    let latitude: number | null = null
    let longitude: number | null = null
    const radius_km = parseFloat(radiusStr ?? "10")

    // ✅ If location_url is provided, extract coordinates
    if (location_url) {
      const coords = await getUrlData(location_url)
      if (!coords) {
        return res
          .status(400)
          .json(errorResponse("Unable to extract coordinates from location_url"))
      }
      latitude = coords.latitude
      longitude = coords.longitude
    }

    // ✅ If lat/lng are provided directly, use them
    if (!location_url && latStr && lngStr) {
      latitude = parseFloat(latStr)
      longitude = parseFloat(lngStr)
    }

    // ❌ If neither is valid
    if (latitude === null || longitude === null) {
      return res.status(400).json(errorResponse("Either lat/lng or location_url must be provided"))
    }

    const vendors = await getVendorsByLocation(latitude, longitude, radius_km)
    return res.status(200).json(successResponse("Vendors fetched successfully", vendors))
  } catch (err: any) {
    console.error("Error in getVendorsByLocationHandler:", err)
    return res.status(500).json(errorResponse("Internal server error"))
  }
}
