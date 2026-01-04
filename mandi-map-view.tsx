"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Navigation, TrendingUp, TrendingDown, Minus, Info } from "lucide-react"

interface MandiLocation {
  id: string
  name: string
  district: string
  lat: number
  lng: number
  status: "active" | "closed" | "moderate"
  avgPrice: number
  priceChange: number
  distance: number
  topCrops: string[]
}

const mandiLocations: MandiLocation[] = [
  {
    id: "1",
    name: "Kakinada",
    district: "East Godavari",
    lat: 16.9891,
    lng: 82.2475,
    status: "active",
    avgPrice: 2450,
    priceChange: 5.2,
    distance: 12,
    topCrops: ["Rice", "Coconut", "Groundnut"],
  },
  {
    id: "2",
    name: "Rajahmundry",
    district: "East Godavari",
    lat: 17.0005,
    lng: 81.804,
    status: "active",
    avgPrice: 2380,
    priceChange: 3.1,
    distance: 25,
    topCrops: ["Rice", "Turmeric", "Chillies"],
  },
  {
    id: "3",
    name: "Amalapuram",
    district: "East Godavari",
    lat: 16.5788,
    lng: 82.005,
    status: "active",
    avgPrice: 2420,
    priceChange: -1.5,
    distance: 35,
    topCrops: ["Rice", "Banana", "Coconut"],
  },
  {
    id: "4",
    name: "Peddapuram",
    district: "East Godavari",
    lat: 17.0769,
    lng: 82.1378,
    status: "moderate",
    avgPrice: 2350,
    priceChange: 2.0,
    distance: 18,
    topCrops: ["Groundnut", "Cotton", "Rice"],
  },
  {
    id: "5",
    name: "Samalkot",
    district: "East Godavari",
    lat: 17.0563,
    lng: 82.178,
    status: "active",
    avgPrice: 2400,
    priceChange: 4.5,
    distance: 15,
    topCrops: ["Rice", "Sugarcane", "Turmeric"],
  },
  {
    id: "6",
    name: "Eluru",
    district: "West Godavari",
    lat: 16.7107,
    lng: 81.0952,
    status: "active",
    avgPrice: 2500,
    priceChange: 6.3,
    distance: 45,
    topCrops: ["Rice", "Oil Palm", "Coconut"],
  },
  {
    id: "7",
    name: "Bhimavaram",
    district: "West Godavari",
    lat: 16.5449,
    lng: 81.5212,
    status: "active",
    avgPrice: 2480,
    priceChange: 4.8,
    distance: 55,
    topCrops: ["Rice", "Aqua", "Coconut"],
  },
  {
    id: "8",
    name: "Tadepalligudem",
    district: "West Godavari",
    lat: 16.8143,
    lng: 81.5279,
    status: "moderate",
    avgPrice: 2390,
    priceChange: -0.5,
    distance: 50,
    topCrops: ["Rice", "Mango", "Cashew"],
  },
  {
    id: "9",
    name: "Tanuku",
    district: "West Godavari",
    lat: 16.7545,
    lng: 81.68,
    status: "active",
    avgPrice: 2440,
    priceChange: 3.7,
    distance: 48,
    topCrops: ["Rice", "Turmeric", "Banana"],
  },
  {
    id: "10",
    name: "Narsapur",
    district: "West Godavari",
    lat: 16.434,
    lng: 81.6967,
    status: "closed",
    avgPrice: 2360,
    priceChange: 0,
    distance: 60,
    topCrops: ["Rice", "Coconut", "Fish"],
  },
  {
    id: "11",
    name: "Palakol",
    district: "West Godavari",
    lat: 16.5167,
    lng: 81.7333,
    status: "active",
    avgPrice: 2410,
    priceChange: 2.9,
    distance: 58,
    topCrops: ["Rice", "Jute", "Coconut"],
  },
  {
    id: "12",
    name: "Kovvur",
    district: "West Godavari",
    lat: 17.0167,
    lng: 81.7333,
    status: "active",
    avgPrice: 2370,
    priceChange: 1.8,
    distance: 40,
    topCrops: ["Rice", "Cotton", "Groundnut"],
  },
]

export function MandiMapView() {
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [selectedMandi, setSelectedMandi] = useState<MandiLocation | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationError(null)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationError("Unable to get your location")
          setUserLocation({ lat: 16.9891, lng: 82.2475 })
        },
      )
    } else {
      setLocationError("Geolocation not supported")
      setUserLocation({ lat: 16.9891, lng: 82.2475 })
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "closed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Open</Badge>
      case "moderate":
        return <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const openGoogleMapsDirections = (mandi: MandiLocation) => {
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : `${mandi.lat},${mandi.lng}`
    const destination = `${mandi.lat},${mandi.lng}`

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`

    window.open(googleMapsUrl, "_blank")
  }

  const filteredMandis =
    selectedDistrict === "all" ? mandiLocations : mandiLocations.filter((m) => m.district === selectedDistrict)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-medium">Filter by District:</span>
        </div>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            <SelectItem value="East Godavari">East Godavari</SelectItem>
            <SelectItem value="West Godavari">West Godavari</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Closed</span>
          </div>
        </div>
        {locationError && (
          <div className="text-xs text-amber-600 flex items-center gap-1">
            <Navigation className="h-3 w-3" />
            Using default location
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Andhra Pradesh - Godavari Region Mandis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 min-h-[400px] border-2 border-dashed border-primary/20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
                <path
                  d="M50,200 Q100,100 200,80 Q300,60 400,100 Q500,140 550,200 Q500,280 400,320 Q300,360 200,340 Q100,320 50,200 Z"
                  fill="#e8f5e9"
                  stroke="#4caf50"
                  strokeWidth="2"
                />
                <path
                  d="M350,120 Q400,100 450,130 Q480,160 470,200 Q450,240 400,250 Q360,240 350,200 Q340,160 350,120 Z"
                  fill="#c8e6c9"
                  stroke="#2e7d32"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
                <text x="400" y="170" fontSize="12" fill="#1b5e20" fontWeight="bold" textAnchor="middle">
                  East Godavari
                </text>
                <path
                  d="M250,140 Q300,120 340,150 Q360,180 350,220 Q330,260 280,270 Q240,260 230,220 Q220,180 250,140 Z"
                  fill="#a5d6a7"
                  stroke="#2e7d32"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
                <text x="290" y="195" fontSize="12" fill="#1b5e20" fontWeight="bold" textAnchor="middle">
                  West Godavari
                </text>
                <path
                  d="M150,180 Q250,160 350,170 Q450,180 520,200"
                  fill="none"
                  stroke="#2196f3"
                  strokeWidth="3"
                  strokeDasharray="5,3"
                />
                <text x="350" y="155" fontSize="10" fill="#1976d2">
                  Godavari River
                </text>
                {filteredMandis.map((mandi, index) => {
                  const x = ((mandi.lng - 81) / 2) * 400 + 150
                  const y = ((17.5 - mandi.lat) / 1.5) * 300 + 80

                  return (
                    <g
                      key={mandi.id}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setSelectedMandi(mandi)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={selectedMandi?.id === mandi.id ? 12 : 8}
                        className={`${getStatusColor(mandi.status)} ${selectedMandi?.id === mandi.id ? "animate-pulse" : ""}`}
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y + 20}
                        fontSize="9"
                        fill="#333"
                        textAnchor="middle"
                        fontWeight={selectedMandi?.id === mandi.id ? "bold" : "normal"}
                      >
                        {mandi.name}
                      </text>
                      <text x={x} y={y - 12} fontSize="8" fill="#1b5e20" textAnchor="middle" fontWeight="bold">
                        ₹{mandi.avgPrice}
                      </text>
                    </g>
                  )
                })}
                <g>
                  <circle cx="420" cy="150" r="6" fill="#f44336" stroke="white" strokeWidth="2" />
                  <circle cx="420" cy="150" r="15" fill="none" stroke="#f44336" strokeWidth="1" opacity="0.5">
                    <animate attributeName="r" from="6" to="20" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="420" y="138" fontSize="8" fill="#c62828" textAnchor="middle">
                    You
                  </text>
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Mandi Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMandi ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{selectedMandi.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMandi.district}</p>
                  </div>
                  {getStatusBadge(selectedMandi.status)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Avg Price</p>
                    <p className="font-bold text-lg text-primary">₹{selectedMandi.avgPrice}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Price Change</p>
                    <p
                      className={`font-bold text-lg flex items-center gap-1 ${selectedMandi.priceChange > 0 ? "text-green-600" : selectedMandi.priceChange < 0 ? "text-red-600" : "text-gray-600"}`}
                    >
                      {selectedMandi.priceChange > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : selectedMandi.priceChange < 0 ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                      {selectedMandi.priceChange > 0 ? "+" : ""}
                      {selectedMandi.priceChange}%
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Navigation className="h-3 w-3" /> Distance from you
                  </p>
                  <p className="font-bold text-lg">{selectedMandi.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Top Crops Traded:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMandi.topCrops.map((crop, i) => (
                      <Badge key={i} variant="outline">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => openGoogleMapsDirections(selectedMandi)}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Opens Google Maps with directions from your location
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click on a mandi marker to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Mandis ({filteredMandis.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMandis
              .sort((a, b) => a.distance - b.distance)
              .map((mandi) => (
                <div
                  key={mandi.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedMandi?.id === mandi.id ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}
                  onClick={() => setSelectedMandi(mandi)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{mandi.name}</h4>
                      <p className="text-xs text-muted-foreground">{mandi.district}</p>
                    </div>
                    {getStatusBadge(mandi.status)}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary font-bold">₹{mandi.avgPrice}/qtl</span>
                    <span className="text-muted-foreground">{mandi.distance} km</span>
                  </div>
                  <div
                    className={`text-xs mt-1 flex items-center gap-1 ${mandi.priceChange > 0 ? "text-green-600" : mandi.priceChange < 0 ? "text-red-600" : "text-gray-600"}`}
                  >
                    {mandi.priceChange > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : mandi.priceChange < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {mandi.priceChange > 0 ? "+" : ""}
                    {mandi.priceChange}% from yesterday
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
