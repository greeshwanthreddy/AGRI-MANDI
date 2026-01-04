import { type NextRequest, NextResponse } from "next/server"

// Manual mandi prices data for Andhra Pradesh (East & West Godavari districts)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get("state") || "Andhra Pradesh"
  const district = searchParams.get("district") || ""
  const commodity = searchParams.get("commodity") || searchParams.get("crop") || ""

  console.log("[v0] API called with:", { state, district, commodity })

  try {
    const manualData = getManualMandiData(state, district, commodity)

    console.log("[v0] Returning data count:", manualData.length)

    return NextResponse.json({
      success: true,
      count: manualData.length,
      data: manualData,
      prices: manualData.map((item) => ({
        mandi: item.market,
        district: item.district,
        price: item.modalPrice,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        change: Math.round((Math.random() - 0.3) * 10),
        trustScore: item.trustScore,
        verified: item.verified,
        lastUpdated: new Date().toLocaleString("en-IN"),
        distance: Math.round(5 + Math.random() * 45),
        unit: item.unit,
        arrivals: item.reports,
      })),
      lastUpdated: new Date().toLocaleString("en-IN"),
      source: "manual-database",
    })
  } catch (error) {
    console.error("Error preparing mandi data:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mandi prices",
        data: [],
        prices: [],
      },
      { status: 500 },
    )
  }
}

function normalizeDistrict(district: string): string {
  const districtMap: Record<string, string> = {
    east_godavari: "East Godavari",
    "east godavari": "East Godavari",
    eastgodavari: "East Godavari",
    west_godavari: "West Godavari",
    "west godavari": "West Godavari",
    westgodavari: "West Godavari",
    all: "all",
  }

  const normalized = district.toLowerCase().trim()
  return districtMap[normalized] || district
}

function normalizeCommodity(commodity: string): string {
  const commodityMap: Record<string, string> = {
    rice: "Rice",
    paddy: "Paddy",
    groundnut: "Groundnut",
    cotton: "Cotton",
    maize: "Maize",
    chillies: "Chillies",
    chilli: "Chillies",
    turmeric: "Turmeric",
    sugarcane: "Sugarcane",
    banana: "Banana",
    coconut: "Coconut",
    "black gram": "Black Gram",
    black_gram: "Black Gram",
    blackgram: "Black Gram",
    "green gram": "Green Gram",
    green_gram: "Green Gram",
    greengram: "Green Gram",
  }

  const normalized = commodity.toLowerCase().trim()
  return commodityMap[normalized] || commodity
}

function getManualMandiData(state: string, district: string, commodity: string) {
  const normalizedDistrict = normalizeDistrict(district)
  const normalizedCommodity = normalizeCommodity(commodity)

  console.log("[v0] Normalized values:", { normalizedDistrict, normalizedCommodity })

  const mandisDatabase = {
    "East Godavari": [
      {
        name: "Kakinada APMC",
        location: "Kakinada",
        mandanNumber: "AP-EG-001",
        established: 1980,
      },
      {
        name: "Rajahmundry Mandi",
        location: "Rajahmundry",
        mandanNumber: "AP-EG-002",
        established: 1975,
      },
      {
        name: "Amalapuram Market",
        location: "Amalapuram",
        mandanNumber: "AP-EG-003",
        established: 1985,
      },
      {
        name: "Peddapuram Wholesale",
        location: "Peddapuram",
        mandanNumber: "AP-EG-004",
        established: 1990,
      },
      {
        name: "Samalkot Trading Hub",
        location: "Samalkot",
        mandanNumber: "AP-EG-005",
        established: 1988,
      },
      {
        name: "Tuni Mandi",
        location: "Tuni",
        mandanNumber: "AP-EG-006",
        established: 1982,
      },
      {
        name: "Ramachandrapuram Market",
        location: "Ramachandrapuram",
        mandanNumber: "AP-EG-007",
        established: 1987,
      },
    ],
    "West Godavari": [
      {
        name: "Eluru APMC",
        location: "Eluru",
        mandanNumber: "AP-WG-001",
        established: 1979,
      },
      {
        name: "Bhimavaram Mandi",
        location: "Bhimavaram",
        mandanNumber: "AP-WG-002",
        established: 1981,
      },
      {
        name: "Tadepalligudem Market",
        location: "Tadepalligudem",
        mandanNumber: "AP-WG-003",
        established: 1983,
      },
      {
        name: "Tanuku Trading Center",
        location: "Tanuku",
        mandanNumber: "AP-WG-004",
        established: 1986,
      },
      {
        name: "Narasapuram Wholesale",
        location: "Narasapuram",
        mandanNumber: "AP-WG-005",
        established: 1984,
      },
      {
        name: "Palakol Mandi",
        location: "Palakol",
        mandanNumber: "AP-WG-006",
        established: 1989,
      },
      {
        name: "Kovvur Market",
        location: "Kovvur",
        mandanNumber: "AP-WG-007",
        established: 1991,
      },
    ],
  }

  const commodityDatabase: Record<string, { min: number; max: number; modal: number; unit: string }> = {
    Rice: { min: 2100, max: 2900, modal: 2500, unit: "₹/quintal" },
    Paddy: { min: 1700, max: 2300, modal: 2000, unit: "₹/quintal" },
    Groundnut: { min: 5200, max: 6800, modal: 6000, unit: "₹/quintal" },
    Cotton: { min: 6000, max: 7500, modal: 6700, unit: "₹/quintal" },
    Maize: { min: 1800, max: 2400, modal: 2100, unit: "₹/quintal" },
    Chillies: { min: 11000, max: 19000, modal: 15000, unit: "₹/quintal" },
    Turmeric: { min: 7500, max: 12500, modal: 10000, unit: "₹/quintal" },
    Sugarcane: { min: 270, max: 360, modal: 310, unit: "₹/quintal" },
    Banana: { min: 1100, max: 2100, modal: 1600, unit: "₹/quintal" },
    Coconut: { min: 14000, max: 23000, modal: 18500, unit: "₹/1000 nuts" },
    "Black Gram": { min: 6200, max: 8300, modal: 7200, unit: "₹/quintal" },
    "Green Gram": { min: 6800, max: 8800, modal: 7700, unit: "₹/quintal" },
  }

  let selectedMandis: any[] = []

  if (normalizedDistrict === "all" || normalizedDistrict === "") {
    selectedMandis = [...(mandisDatabase["East Godavari"] || []), ...(mandisDatabase["West Godavari"] || [])]
  } else if (mandisDatabase[normalizedDistrict as keyof typeof mandisDatabase]) {
    selectedMandis = mandisDatabase[normalizedDistrict as keyof typeof mandisDatabase]
  }

  console.log("[v0] Selected mandis count:", selectedMandis.length)

  const prices = commodityDatabase[normalizedCommodity] || { min: 2000, max: 3000, modal: 2500, unit: "₹/quintal" }

  const results = selectedMandis.map((mandi, index) => {
    // Small random variation (+/- 5%) to simulate realistic price differences across mandis
    const priceVariation = (Math.random() - 0.5) * 0.1
    const minPrice = Math.round(prices.min * (1 + priceVariation))
    const maxPrice = Math.round(prices.max * (1 + priceVariation))
    const modalPrice = Math.round(prices.modal * (1 + priceVariation))

    // Higher trust score for older established mandis
    const baseScore = 75 + (2020 - mandi.established) * 0.5
    const trustScore = Math.min(Math.round(baseScore + Math.random() * 10), 98)

    return {
      id: index + 1,
      market: mandi.name,
      location: mandi.location,
      district:
        normalizedDistrict === "all" || normalizedDistrict === ""
          ? index < 7
            ? "East Godavari"
            : "West Godavari"
          : normalizedDistrict,
      state: "Andhra Pradesh",
      commodity: normalizedCommodity || "Rice",
      variety: "Standard",
      minPrice,
      maxPrice,
      modalPrice,
      unit: prices.unit,
      arrivalDate: new Date().toISOString().split("T")[0],
      trustScore,
      verified: trustScore > 80,
      reports: Math.floor(Math.random() * 250) + 30,
      priceReports: Math.floor(Math.random() * 50) + 10,
    }
  })

  return results.sort((a, b) => b.modalPrice - a.modalPrice)
}
