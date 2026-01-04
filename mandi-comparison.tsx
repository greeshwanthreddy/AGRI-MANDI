"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Plus, X, TrendingUp, TrendingDown, MapPin, Star, Clock, Truck } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface MandiData {
  id: string
  name: string
  district: string
  crops: {
    name: string
    price: number
    change: number
    volume: number
  }[]
  distance: number
  avgRating: number
  trustScore: number
  avgWaitTime: number
  demandLevel: "high" | "medium" | "low"
}

const mandisData: MandiData[] = [
  {
    id: "1",
    name: "Kakinada",
    district: "East Godavari",
    crops: [
      { name: "Rice", price: 2450, change: 5.2, volume: 1200 },
      { name: "Groundnut", price: 5850, change: 2.1, volume: 450 },
      { name: "Cotton", price: 6800, change: -1.5, volume: 320 },
    ],
    distance: 12,
    avgRating: 4.5,
    trustScore: 92,
    avgWaitTime: 45,
    demandLevel: "high",
  },
  {
    id: "2",
    name: "Rajahmundry",
    district: "East Godavari",
    crops: [
      { name: "Rice", price: 2380, change: 3.1, volume: 1500 },
      { name: "Groundnut", price: 5750, change: 1.8, volume: 380 },
      { name: "Cotton", price: 6650, change: 0.5, volume: 280 },
    ],
    distance: 25,
    avgRating: 4.2,
    trustScore: 88,
    avgWaitTime: 60,
    demandLevel: "high",
  },
  {
    id: "3",
    name: "Eluru",
    district: "West Godavari",
    crops: [
      { name: "Rice", price: 2500, change: 6.3, volume: 1800 },
      { name: "Groundnut", price: 5920, change: 3.5, volume: 520 },
      { name: "Cotton", price: 6750, change: 2.0, volume: 400 },
    ],
    distance: 45,
    avgRating: 4.7,
    trustScore: 95,
    avgWaitTime: 35,
    demandLevel: "medium",
  },
  {
    id: "4",
    name: "Bhimavaram",
    district: "West Godavari",
    crops: [
      { name: "Rice", price: 2480, change: 4.8, volume: 1400 },
      { name: "Groundnut", price: 5800, change: 2.2, volume: 400 },
      { name: "Cotton", price: 6700, change: 1.2, volume: 350 },
    ],
    distance: 55,
    avgRating: 4.3,
    trustScore: 90,
    avgWaitTime: 50,
    demandLevel: "medium",
  },
  {
    id: "5",
    name: "Amalapuram",
    district: "East Godavari",
    crops: [
      { name: "Rice", price: 2420, change: -1.5, volume: 900 },
      { name: "Groundnut", price: 5700, change: 0.8, volume: 300 },
      { name: "Cotton", price: 6600, change: -0.5, volume: 220 },
    ],
    distance: 35,
    avgRating: 4.0,
    trustScore: 85,
    avgWaitTime: 55,
    demandLevel: "low",
  },
  {
    id: "6",
    name: "Tanuku",
    district: "West Godavari",
    crops: [
      { name: "Rice", price: 2440, change: 3.7, volume: 1100 },
      { name: "Groundnut", price: 5780, change: 1.5, volume: 350 },
      { name: "Cotton", price: 6680, change: 0.8, volume: 300 },
    ],
    distance: 48,
    avgRating: 4.4,
    trustScore: 89,
    avgWaitTime: 40,
    demandLevel: "medium",
  },
]

export function MandiComparison() {
  const [selectedMandis, setSelectedMandis] = useState<string[]>(["1", "3"])
  const [selectedCrop, setSelectedCrop] = useState("Rice")
  const [comparisonMetric, setComparisonMetric] = useState("price")

  const addMandi = (id: string) => {
    if (selectedMandis.length < 4 && !selectedMandis.includes(id)) {
      setSelectedMandis([...selectedMandis, id])
    }
  }

  const removeMandi = (id: string) => {
    setSelectedMandis(selectedMandis.filter((m) => m !== id))
  }

  const selectedMandiData = mandisData.filter((m) => selectedMandis.includes(m.id))

  // Prepare chart data
  const priceComparisonData = selectedMandiData.map((mandi) => ({
    name: mandi.name,
    price: mandi.crops.find((c) => c.name === selectedCrop)?.price || 0,
    change: mandi.crops.find((c) => c.name === selectedCrop)?.change || 0,
  }))

  const radarData = [
    { metric: "Price", fullMark: 100 },
    { metric: "Trust Score", fullMark: 100 },
    { metric: "Distance", fullMark: 100 },
    { metric: "Wait Time", fullMark: 100 },
    { metric: "Rating", fullMark: 100 },
  ].map((item) => {
    const dataPoint: any = { metric: item.metric }
    selectedMandiData.forEach((mandi) => {
      let value = 0
      switch (item.metric) {
        case "Price":
          const maxPrice = Math.max(
            ...mandisData.flatMap((m) => m.crops.find((c) => c.name === selectedCrop)?.price || 0),
          )
          value = ((mandi.crops.find((c) => c.name === selectedCrop)?.price || 0) / maxPrice) * 100
          break
        case "Trust Score":
          value = mandi.trustScore
          break
        case "Distance":
          const maxDistance = Math.max(...mandisData.map((m) => m.distance))
          value = 100 - (mandi.distance / maxDistance) * 100
          break
        case "Wait Time":
          const maxWait = Math.max(...mandisData.map((m) => m.avgWaitTime))
          value = 100 - (mandi.avgWaitTime / maxWait) * 100
          break
        case "Rating":
          value = (mandi.avgRating / 5) * 100
          break
      }
      dataPoint[mandi.name] = Math.round(value)
    })
    return dataPoint
  })

  const getDemandBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge className="bg-green-100 text-green-800">High Demand</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Demand</Badge>
      case "low":
        return <Badge className="bg-red-100 text-red-800">Low Demand</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const colors = ["#16a34a", "#2563eb", "#d97706", "#dc2626"]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Compare Mandis
          </CardTitle>
          <CardDescription>Select up to 4 mandis to compare prices, trust scores, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Add Mandi</label>
              <Select onValueChange={addMandi} disabled={selectedMandis.length >= 4}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mandi to add" />
                </SelectTrigger>
                <SelectContent>
                  {mandisData
                    .filter((m) => !selectedMandis.includes(m.id))
                    .map((mandi) => (
                      <SelectItem key={mandi.id} value={mandi.id}>
                        {mandi.name} ({mandi.district})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Compare Crop</label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Groundnut">Groundnut</SelectItem>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Mandis Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedMandiData.map((mandi, i) => (
              <Badge
                key={mandi.id}
                variant="outline"
                className="px-3 py-1 text-sm"
                style={{ borderColor: colors[i], color: colors[i] }}
              >
                {mandi.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2 hover:bg-transparent"
                  onClick={() => removeMandi(mandi.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedMandis.length < 4 && (
              <Badge variant="outline" className="px-3 py-1 text-sm text-muted-foreground border-dashed">
                <Plus className="h-3 w-3 mr-1" />
                Add more ({4 - selectedMandis.length} left)
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedMandis.length >= 2 ? (
        <>
          {/* Price Comparison Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Comparison - {selectedCrop}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`₹${value}`, "Price"]}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                      />
                      <Bar dataKey="price" fill="#16a34a" radius={[4, 4, 0, 0]}>
                        {priceComparisonData.map((entry, index) => (
                          <Bar key={`bar-${index}`} dataKey="price" fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      {selectedMandiData.map((mandi, i) => (
                        <Radar
                          key={mandi.id}
                          name={mandi.name}
                          dataKey={mandi.name}
                          stroke={colors[i]}
                          fill={colors[i]}
                          fillOpacity={0.2}
                        />
                      ))}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Metric</th>
                      {selectedMandiData.map((mandi, i) => (
                        <th key={mandi.id} className="text-center p-3 font-medium" style={{ color: colors[i] }}>
                          {mandi.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 flex items-center gap-2">
                        <span className="font-medium">{selectedCrop} Price</span>
                      </td>
                      {selectedMandiData.map((mandi) => {
                        const cropData = mandi.crops.find((c) => c.name === selectedCrop)
                        const maxPrice = Math.max(
                          ...selectedMandiData.map((m) => m.crops.find((c) => c.name === selectedCrop)?.price || 0),
                        )
                        const isHighest = cropData?.price === maxPrice
                        return (
                          <td key={mandi.id} className="text-center p-3">
                            <span className={`font-bold ${isHighest ? "text-green-600" : ""}`}>
                              ₹{cropData?.price}
                              {isHighest && <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Best</Badge>}
                            </span>
                            <div
                              className={`text-xs flex items-center justify-center gap-1 ${(cropData?.change || 0) > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {(cropData?.change || 0) > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {(cropData?.change || 0) > 0 ? "+" : ""}
                              {cropData?.change}%
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Distance</span>
                      </td>
                      {selectedMandiData.map((mandi) => {
                        const minDistance = Math.min(...selectedMandiData.map((m) => m.distance))
                        const isNearest = mandi.distance === minDistance
                        return (
                          <td key={mandi.id} className="text-center p-3">
                            <span className={isNearest ? "text-green-600 font-bold" : ""}>
                              {mandi.distance} km
                              {isNearest && <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Nearest</Badge>}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Trust Score</span>
                      </td>
                      {selectedMandiData.map((mandi) => (
                        <td key={mandi.id} className="text-center p-3">
                          <span className={mandi.trustScore >= 90 ? "text-green-600 font-bold" : ""}>
                            {mandi.trustScore}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Avg Wait Time</span>
                      </td>
                      {selectedMandiData.map((mandi) => (
                        <td key={mandi.id} className="text-center p-3">
                          {mandi.avgWaitTime} mins
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Demand Level</span>
                      </td>
                      {selectedMandiData.map((mandi) => (
                        <td key={mandi.id} className="text-center p-3">
                          {getDemandBadge(mandi.demandLevel)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Rating</span>
                      </td>
                      {selectedMandiData.map((mandi) => (
                        <td key={mandi.id} className="text-center p-3">
                          <span className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {mandi.avgRating.toFixed(1)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-green-800">Recommendation</h3>
                  <p className="text-green-700">
                    Based on {selectedCrop} prices, trust scores, and distance,{" "}
                    <strong>
                      {(() => {
                        const scored = selectedMandiData.map((m) => ({
                          ...m,
                          score:
                            (m.crops.find((c) => c.name === selectedCrop)?.price || 0) * 0.4 +
                            m.trustScore * 20 +
                            (100 - m.distance) * 10 +
                            (100 - m.avgWaitTime) * 5,
                        }))
                        return scored.sort((a, b) => b.score - a.score)[0]?.name
                      })()}
                    </strong>{" "}
                    offers the best overall value for selling your {selectedCrop}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Scale className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Select at least 2 mandis to compare</h3>
            <p className="text-muted-foreground">Use the dropdown above to add mandis for comparison</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
