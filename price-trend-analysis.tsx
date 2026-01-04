"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Activity, AlertTriangle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  ComposedChart,
} from "recharts"

const crops = [
  { value: "rice", label: "Rice (వరి)" },
  { value: "paddy", label: "Paddy (ధాన్యం)" },
  { value: "groundnut", label: "Groundnut (వేరుశనగ)" },
  { value: "cotton", label: "Cotton (పత్తి)" },
  { value: "chillies", label: "Chillies (మిర్చి)" },
  { value: "turmeric", label: "Turmeric (పసుపు)" },
]

// Generate realistic price data
const generatePriceData = (crop: string, period: string) => {
  const basePrice =
    crop === "rice"
      ? 2400
      : crop === "cotton"
        ? 6500
        : crop === "chillies"
          ? 12000
          : crop === "turmeric"
            ? 8500
            : crop === "groundnut"
              ? 5800
              : 2200
  const volatility = crop === "chillies" ? 0.15 : crop === "cotton" ? 0.1 : 0.05

  const dataPoints = period === "weekly" ? 7 : period === "monthly" ? 30 : 12
  const labels =
    period === "weekly"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : period === "monthly"
        ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  let price = basePrice
  return labels.slice(0, dataPoints).map((label, i) => {
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice
    price = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, price + change))
    const minPrice = price * (1 - Math.random() * 0.05)
    const maxPrice = price * (1 + Math.random() * 0.05)
    return {
      name: label,
      price: Math.round(price),
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      volume: Math.round(500 + Math.random() * 1500),
      predicted: i === dataPoints - 1 ? null : Math.round(price * (1 + (Math.random() - 0.5) * 0.1)),
    }
  })
}

// Predictive data for next 7 days
const generatePredictiveData = (crop: string) => {
  const basePrice = crop === "rice" ? 2450 : crop === "cotton" ? 6600 : 2300
  return Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    predicted: Math.round(basePrice * (1 + i * 0.008 + (Math.random() - 0.5) * 0.02)),
    confidence: Math.round(95 - i * 5),
    lower: Math.round(basePrice * (1 + i * 0.005)),
    upper: Math.round(basePrice * (1 + i * 0.012)),
  }))
}

export function PriceTrendAnalysis() {
  const [selectedCrop, setSelectedCrop] = useState("rice")
  const [period, setPeriod] = useState("monthly")

  const priceData = generatePriceData(selectedCrop, period)
  const predictiveData = generatePredictiveData(selectedCrop)

  const currentPrice = priceData[priceData.length - 1]?.price || 0
  const previousPrice = priceData[priceData.length - 2]?.price || currentPrice
  const priceChange = (((currentPrice - previousPrice) / previousPrice) * 100).toFixed(2)
  const avgPrice = Math.round(priceData.reduce((acc, d) => acc + d.price, 0) / priceData.length)
  const maxPrice = Math.max(...priceData.map((d) => d.maxPrice))
  const minPrice = Math.min(...priceData.map((d) => d.minPrice))

  // Calculate volatility
  const priceChanges = priceData.slice(1).map((d, i) => Math.abs(d.price - priceData[i].price) / priceData[i].price)
  const volatility = ((priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length) * 100).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium">Select Crop:</span>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop.value} value={crop.value}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Period:</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="text-2xl font-bold text-primary">₹{currentPrice}</p>
            <p
              className={`text-xs flex items-center gap-1 ${Number(priceChange) > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {Number(priceChange) > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {priceChange}% from previous
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Average Price</p>
            <p className="text-2xl font-bold">₹{avgPrice}</p>
            <p className="text-xs text-muted-foreground">{period} average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Highest</p>
            <p className="text-2xl font-bold text-green-600">₹{maxPrice}</p>
            <p className="text-xs text-muted-foreground">Peak price</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Lowest</p>
            <p className="text-2xl font-bold text-red-600">₹{minPrice}</p>
            <p className="text-xs text-muted-foreground">Bottom price</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Volatility</p>
            <p
              className={`text-2xl font-bold ${Number(volatility) > 5 ? "text-red-600" : Number(volatility) > 2 ? "text-yellow-600" : "text-green-600"}`}
            >
              {volatility}%
            </p>
            <Badge
              variant={Number(volatility) > 5 ? "destructive" : Number(volatility) > 2 ? "secondary" : "default"}
              className="text-xs"
            >
              {Number(volatility) > 5 ? "High Risk" : Number(volatility) > 2 ? "Moderate" : "Stable"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trend">Price Trend</TabsTrigger>
          <TabsTrigger value="range">Price Range</TabsTrigger>
          <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          <TabsTrigger value="predict">Prediction</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Price Trend - {crops.find((c) => c.value === selectedCrop)?.label}
              </CardTitle>
              <CardDescription>Historical price movement over {period} period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                      formatter={(value: number) => [`₹${value}`, "Price"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ fill: "#16a34a", strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                      name="Price (₹/qtl)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="range">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Price Range Analysis
              </CardTitle>
              <CardDescription>Min, Max, and Average price range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                      formatter={(value: number) => [`₹${value}`, ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="maxPrice"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#bbf7d0"
                      name="Max Price"
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stackId="2"
                      stroke="#16a34a"
                      fill="#86efac"
                      name="Avg Price"
                    />
                    <Area
                      type="monotone"
                      dataKey="minPrice"
                      stackId="3"
                      stroke="#15803d"
                      fill="#dcfce7"
                      name="Min Price"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Volume & Price Analysis
              </CardTitle>
              <CardDescription>Trading volume alongside price movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Bar yAxisId="right" dataKey="volume" fill="#94a3b8" name="Volume (qtl)" radius={[4, 4, 0, 0]} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="price"
                      stroke="#16a34a"
                      strokeWidth={3}
                      name="Price (₹)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predict">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                7-Day Price Prediction
              </CardTitle>
              <CardDescription>AI-based price forecast with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Prediction Disclaimer</p>
                  <p className="text-xs text-yellow-700">
                    Predictions are based on historical data and market patterns. Actual prices may vary due to external
                    factors.
                  </p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictiveData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}
                      formatter={(value: number, name: string) => [
                        `₹${value}`,
                        name === "predicted" ? "Predicted" : name === "upper" ? "Upper Bound" : "Lower Bound",
                      ]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="upper" stroke="transparent" fill="#bbf7d0" name="Upper Bound" />
                    <Area type="monotone" dataKey="lower" stroke="transparent" fill="#fff" name="Lower Bound" />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#16a34a"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: "#16a34a", strokeWidth: 2 }}
                      name="Predicted Price"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {predictiveData.slice(0, 4).map((day, i) => (
                  <div key={i} className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">{day.day}</p>
                    <p className="font-bold text-primary">₹{day.predicted}</p>
                    <Badge variant="outline" className="text-xs">
                      {day.confidence}% confidence
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
