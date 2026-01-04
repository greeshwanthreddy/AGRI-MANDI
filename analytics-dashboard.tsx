"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, PieChartIcon, Activity, Users, IndianRupee, Leaf } from "lucide-react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"

// Market Overview Data
const marketOverviewData = [
  { month: "Jul", transactions: 4500, volume: 12500, avgPrice: 2350 },
  { month: "Aug", transactions: 5200, volume: 14200, avgPrice: 2280 },
  { month: "Sep", transactions: 6100, volume: 16800, avgPrice: 2420 },
  { month: "Oct", transactions: 5800, volume: 15500, avgPrice: 2380 },
  { month: "Nov", transactions: 6500, volume: 17200, avgPrice: 2450 },
  { month: "Dec", transactions: 7200, volume: 19500, avgPrice: 2520 },
]

// Crop Distribution Data
const cropDistributionData = [
  { name: "Rice (వరి)", value: 45, color: "#16a34a" },
  { name: "Groundnut (వేరుశనగ)", value: 18, color: "#eab308" },
  { name: "Cotton (పత్తి)", value: 15, color: "#3b82f6" },
  { name: "Chillies (మిర్చి)", value: 12, color: "#ef4444" },
  { name: "Turmeric (పసుపు)", value: 7, color: "#f97316" },
  { name: "Others", value: 3, color: "#6b7280" },
]

// District-wise Data
const districtData = [
  { district: "East Godavari", mandis: 8, farmers: 12500, avgPrice: 2420, volume: 45000 },
  { district: "West Godavari", mandis: 6, farmers: 9800, avgPrice: 2480, volume: 38000 },
]

// Price Heatmap Data (simplified)
const priceHeatmapData = [
  { crop: "Rice", kakinada: 2450, rajahmundry: 2380, eluru: 2500, bhimavaram: 2480 },
  { crop: "Groundnut", kakinada: 5850, rajahmundry: 5750, eluru: 5920, bhimavaram: 5800 },
  { crop: "Cotton", kakinada: 6800, rajahmundry: 6650, eluru: 6750, bhimavaram: 6700 },
  { crop: "Chillies", kakinada: 12500, rajahmundry: 12200, eluru: 12800, bhimavaram: 12400 },
  { crop: "Turmeric", kakinada: 8600, rajahmundry: 8400, eluru: 8750, bhimavaram: 8500 },
]

// Daily Volume Data
const dailyVolumeData = [
  { day: "Mon", rice: 1800, groundnut: 450, cotton: 320 },
  { day: "Tue", rice: 2100, groundnut: 520, cotton: 380 },
  { day: "Wed", rice: 1950, groundnut: 480, cotton: 340 },
  { day: "Thu", rice: 2300, groundnut: 550, cotton: 420 },
  { day: "Fri", rice: 2500, groundnut: 600, cotton: 450 },
  { day: "Sat", rice: 2800, groundnut: 680, cotton: 500 },
  { day: "Sun", rice: 1200, groundnut: 280, cotton: 180 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">₹42.5 Cr</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +12.5% this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Farmers</p>
                <p className="text-2xl font-bold">22,300</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +850 new
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">83,000 qtl</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +8.2% this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Mandis</p>
                <p className="text-2xl font-bold">14</p>
                <Badge variant="outline" className="text-xs mt-1">
                  All operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Filter */}
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="crops">Crop Analysis</TabsTrigger>
          <TabsTrigger value="heatmap">Price Heatmap</TabsTrigger>
          <TabsTrigger value="districts">District Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Transaction Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={marketOverviewData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="transactions"
                        fill="#16a34a"
                        name="Transactions"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgPrice"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Avg Price (₹)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Volume Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Volume Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketOverviewData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                      />
                      <Area type="monotone" dataKey="volume" stroke="#16a34a" fill="#bbf7d0" name="Volume (qtl)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Volume Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Volume by Crop</CardTitle>
              <CardDescription>Volume traded across major crops this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Bar dataKey="rice" stackId="a" fill="#16a34a" name="Rice" />
                    <Bar dataKey="groundnut" stackId="a" fill="#eab308" name="Groundnut" />
                    <Bar dataKey="cotton" stackId="a" fill="#3b82f6" name="Cotton" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Crop Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Crop Distribution
                </CardTitle>
                <CardDescription>Market share by crop type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cropDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                      >
                        {cropDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Market Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Crop Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cropDistributionData.slice(0, 5).map((crop, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }}></div>
                        <span className="font-medium">{crop.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{crop.value}%</Badge>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${crop.value}%`, backgroundColor: crop.color }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Heatmap Across Mandis</CardTitle>
              <CardDescription>Compare prices across different mandis (₹ per quintal)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Crop</th>
                      <th className="text-center p-3 font-medium">Kakinada</th>
                      <th className="text-center p-3 font-medium">Rajahmundry</th>
                      <th className="text-center p-3 font-medium">Eluru</th>
                      <th className="text-center p-3 font-medium">Bhimavaram</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceHeatmapData.map((row, i) => {
                      const prices = [row.kakinada, row.rajahmundry, row.eluru, row.bhimavaram]
                      const maxPrice = Math.max(...prices)
                      const minPrice = Math.min(...prices)

                      const getHeatColor = (price: number) => {
                        if (price === maxPrice) return "bg-green-100 text-green-800 font-bold"
                        if (price === minPrice) return "bg-red-100 text-red-800"
                        return "bg-yellow-50"
                      }

                      return (
                        <tr key={i} className="border-b">
                          <td className="p-3 font-medium">{row.crop}</td>
                          <td className={`text-center p-3 ${getHeatColor(row.kakinada)}`}>
                            ₹{row.kakinada.toLocaleString()}
                          </td>
                          <td className={`text-center p-3 ${getHeatColor(row.rajahmundry)}`}>
                            ₹{row.rajahmundry.toLocaleString()}
                          </td>
                          <td className={`text-center p-3 ${getHeatColor(row.eluru)}`}>
                            ₹{row.eluru.toLocaleString()}
                          </td>
                          <td className={`text-center p-3 ${getHeatColor(row.bhimavaram)}`}>
                            ₹{row.bhimavaram.toLocaleString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Highest Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                  <span>Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Lowest Price</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="districts" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {districtData.map((district, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{district.district}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{district.mandis}</p>
                      <p className="text-sm text-muted-foreground">Active Mandis</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{district.farmers.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Registered Farmers</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">₹{district.avgPrice}</p>
                      <p className="text-sm text-muted-foreground">Avg Price (Rice)</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{(district.volume / 1000).toFixed(1)}K</p>
                      <p className="text-sm text-muted-foreground">Volume (qtl)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* District Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>District Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" />
                    <YAxis dataKey="district" type="category" width={100} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Bar dataKey="farmers" fill="#16a34a" name="Farmers" />
                    <Bar dataKey="volume" fill="#3b82f6" name="Volume (qtl)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
