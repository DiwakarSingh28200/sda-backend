interface Coordinates {
  latitude: number
  longitude: number
  source: string
}

export function extractCoordinatesFromUrl(url: string): Coordinates | null {
  // Pattern 1: /@latitude,longitude,zoomz
  const pattern1 = /@(-?\d+\.\d+),(-?\d+\.\d+),\d+(?:\.\d+)?z/
  const match1 = url.match(pattern1)
  if (match1) {
    return {
      latitude: parseFloat(match1[1]),
      longitude: parseFloat(match1[2]),
      source: "pattern1",
    }
  }

  // Pattern 2: /latitude,longitude? (e.g., /19.910945,+72.994643?)
  const pattern2 = /\/(-?\d+\.\d+),\+?(-?\d+\.\d+)\?/
  const match2 = url.match(pattern2)
  if (match2) {
    return {
      latitude: parseFloat(match2[1]),
      longitude: parseFloat(match2[2]),
      source: "pattern2",
    }
  }

  // Pattern 3: ?q=latitude,longitude
  const pattern3 = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/
  const match3 = url.match(pattern3)
  if (match3) {
    return {
      latitude: parseFloat(match3[1]),
      longitude: parseFloat(match3[2]),
      source: "pattern3",
    }
  }

  // Pattern 4: !3dlatitude!4dlongitude
  const pattern4 = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/
  const match4 = url.match(pattern4)
  if (match4) {
    return {
      latitude: parseFloat(match4[1]),
      longitude: parseFloat(match4[2]),
      source: "pattern4",
    }
  }

  return null
}

export async function getUrlData(shortUrl: string): Promise<Coordinates | null> {
  if (!shortUrl.trim()) return null

  try {
    const response = await fetch(shortUrl, {
      method: "HEAD",
      redirect: "follow",
    })

    const expandedUrl = response.url
    if (expandedUrl) {
      const coordinates = extractCoordinatesFromUrl(expandedUrl)
      return coordinates
    }

    return null
  } catch (error) {
    console.error("Error expanding Google Maps URL:", error)
    return null
  }
}
