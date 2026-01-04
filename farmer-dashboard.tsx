"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  TrendingUp,
  Star,
  Upload,
  CheckCircle,
  Clock,
  LogOut,
  Leaf,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  AlertTriangle,
  Calendar,
  X,
  FileText,
  Download,
  Map,
  Bell,
  BarChart3,
  FileSpreadsheet,
  Scale,
  Info,
} from "lucide-react"

type User = {
  name: string
  email: string
  role: string
}

import { MandiMapView } from "@/components/mandi-map-view"
import { PriceTrendAnalysis } from "@/components/price-trend-analysis"
import { PriceAlerts } from "@/components/price-alerts"
import { MandiComparison } from "@/components/mandi-comparison"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { LanguageSelector } from "./language-selector"
import { VoiceAssistant } from "./voice-assistant"
import { CropDetailsModal } from "./crop-details-modal"
import { cropDatabase } from "@/lib/crop-data"
import { indiaStatesDistricts } from "@/lib/india-locations"

const districts = [
  { value: "east_godavari", label: "East Godavari", telugu: "తూర్పు గోదావరి" },
  { value: "west_godavari", label: "West Godavari", telugu: "పశ్చిమ గోదావరి" },
]

const mandis: Record<string, { value: string; label: string }[]> = {
  east_godavari: [
    { value: "kakinada", label: "Kakinada APMC" },
    { value: "rajahmundry", label: "Rajahmundry Mandi" },
    { value: "amalapuram", label: "Amalapuram Market" },
    { value: "peddapuram", label: "Peddapuram Wholesale" },
    { value: "samalkot", label: "Samalkot Trading Hub" },
    { value: "tuni", label: "Tuni Mandi" },
    { value: "ramachandrapuram", label: "Ramachandrapuram Market" },
  ],
  west_godavari: [
    { value: "eluru", label: "Eluru APMC" },
    { value: "bhimavaram", label: "Bhimavaram Mandi" },
    { value: "tadepalligudem", label: "Tadepalligudem Market" },
    { value: "tanuku", label: "Tanuku Trading Center" },
    { value: "narasapuram", label: "Narasapuram Wholesale" },
    { value: "palakol", label: "Palakol Mandi" },
    { value: "kovvur", label: "Kovvur Market" },
  ],
}

interface FarmerDashboardProps {
  user: User
  onLogout: () => void
}

interface MandiPrice {
  mandi: string
  district: string
  price: number
  minPrice?: number
  maxPrice?: number
  change: number
  trustScore: number
  verified: boolean
  lastUpdated: string
  distance: number
  unit?: string
  arrivals?: number
}

interface PriceReport {
  id: string
  district: string
  mandi: string
  crop: string
  price: number
  quantity: number
  date: string
  receipt?: string
  receiptName?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

// Crops with English and Telugu names
const crops = [
  { value: "rice", label: "Rice", telugu: "వరి" },
  { value: "paddy", label: "Paddy", telugu: "ధాన్యం" },
  { value: "groundnut", label: "Groundnut", telugu: "వేరుశెనగ" },
  { value: "cotton", label: "Cotton", telugu: "పత్తి" },
  { value: "maize", label: "Maize", telugu: "మొక్కజొన్న" },
  { value: "chillies", label: "Chillies", telugu: "మిర్చి" },
  { value: "turmeric", label: "Turmeric", telugu: "పసుపు" },
  { value: "sugarcane", label: "Sugarcane", telugu: "చెరకు" },
  { value: "banana", label: "Banana", telugu: "అరటి" },
  { value: "coconut", label: "Coconut", telugu: "కొబ్బరి" },
  { value: "black_gram", label: "Black Gram", telugu: "మినుములు" },
  { value: "green_gram", label: "Green Gram", telugu: "పెసలు" },
]

export function FarmerDashboard({ user, onLogout }: FarmerDashboardProps) {
  const [selectedCrop, setSelectedCrop] = useState("paddy")
  const [selectedState, setSelectedState] = useState("Andhra Pradesh")
  const [selectedDistrict, setSelectedDistrict] = useState("east_godavari")
  const [showResults, setShowResults] = useState(false)
  const [reportPrice, setReportPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [mandiData, setMandiData] = useState<MandiPrice[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null)
  const [reportDistrict, setReportDistrict] = useState("")
  const [reportMandi, setReportMandi] = useState("")
  const [reportCrop, setReportCrop] = useState("")
  const [reportQuantity, setReportQuantity] = useState("")
  const [reportDate, setReportDate] = useState("")
  const [formErrors, setFormErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [submittedReports, setSubmittedReports] = useState<PriceReport[]>([])
  const [language, setLanguage] = useState("en")
  const [selectedCropDetails, setSelectedCropDetails] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("find")
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])

  // Load submitted reports from localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem("farmerReports")
    if (savedReports) {
      setSubmittedReports(JSON.parse(savedReports))
    }
  }, [])

  useEffect(() => {
    if (selectedCrop && selectedDistrict) {
      handleSearch()
    }
  }, [])

  useEffect(() => {
    if (selectedState && indiaStatesDistricts[selectedState as keyof typeof indiaStatesDistricts]) {
      const stateData = indiaStatesDistricts[selectedState as keyof typeof indiaStatesDistricts]
      setAvailableDistricts(stateData.districts)
      setSelectedDistrict("") // Reset district when state changes
    }
  }, [selectedState])

  const handleSearch = async () => {
    if (!selectedCrop || !selectedDistrict) {
      return
    }

    setLoading(true)
    try {
      const url = `/api/mandi-prices?crop=${encodeURIComponent(selectedCrop)}&district=${encodeURIComponent(selectedDistrict)}&state=${encodeURIComponent(selectedState)}`

      const response = await fetch(url)
      const data = await response.json()

      const prices = data.prices || []

      setMandiData(prices)
      setLastUpdated(data.lastUpdated || new Date().toLocaleString("en-IN"))
      setShowResults(true)
    } catch (error) {
      console.error("Failed to fetch prices:", error)
      setMandiData([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB")
        return
      }

      setSelectedFile(file)

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedFilePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setUploadedFilePreview(null)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const file = event.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB")
        return
      }

      setSelectedFile(file)

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedFilePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setUploadedFilePreview(null)
      }
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setUploadedFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateReportForm = (): boolean => {
    const errors: string[] = []

    if (!reportDistrict) errors.push("District is required")
    if (!reportMandi) errors.push("Mandi is required")
    if (!reportCrop) errors.push("Crop is required")
    if (!reportPrice || Number.parseFloat(reportPrice) <= 0) errors.push("Valid price is required")
    if (!reportQuantity || Number.parseFloat(reportQuantity) <= 0) errors.push("Valid quantity is required")
    if (!reportDate) errors.push("Transaction date is required")

    setFormErrors(errors)
    return errors.length === 0
  }

  const handleSubmitReport = () => {
    if (!validateReportForm()) {
      return
    }

    const newReport: PriceReport = {
      id: Date.now().toString(),
      district: reportDistrict,
      mandi: reportMandi,
      crop: reportCrop,
      price: Number.parseFloat(reportPrice),
      quantity: Number.parseFloat(reportQuantity),
      date: reportDate,
      receipt: uploadedFilePreview || undefined,
      receiptName: selectedFile?.name,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }

    const updatedReports = [...submittedReports, newReport]
    setSubmittedReports(updatedReports)
    localStorage.setItem("farmerReports", JSON.stringify(updatedReports))

    // Reset form
    setReportDistrict("")
    setReportMandi("")
    setReportCrop("")
    setReportPrice("")
    setReportQuantity("")
    setReportDate("")
    clearSelectedFile()
    setFormErrors([])
    alert("Price report submitted successfully! It will be reviewed by the admin.")
  }

  const getCropDisplayName = (value: string) => {
    const crop = crops.find((c) => c.value === value)
    return crop ? `${crop.label} (${crop.telugu})` : value
  }

  const getDistrictDisplayName = (value: string) => {
    const district = districts.find((d) => d.value === value)
    return district ? `${district.label} (${district.telugu})` : value
  }

  const getMandiDisplayName = (districtValue: string, mandiValue: string) => {
    const districtMandis = mandis[districtValue]
    if (districtMandis) {
      const mandi = districtMandis.find((m) => m.value === mandiValue)
      return mandi ? mandi.label : mandiValue
    }
    return mandiValue
  }

  // Download as CSV
  const downloadAsCSV = () => {
    if (submittedReports.length === 0) {
      alert("No reports to download")
      return
    }

    const headers = [
      "ID",
      "District",
      "Mandi",
      "Crop",
      "Price (₹/qtl)",
      "Quantity (qtl)",
      "Date",
      "Status",
      "Submitted At",
    ]
    const csvContent = [
      headers.join(","),
      ...submittedReports.map((report) =>
        [
          report.id,
          getDistrictDisplayName(report.district),
          getMandiDisplayName(report.district, report.mandi),
          getCropDisplayName(report.crop),
          report.price,
          report.quantity,
          report.date,
          report.status,
          new Date(report.submittedAt).toLocaleString("en-IN"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `my-price-reports-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  // Download as Excel (TSV format)
  const downloadAsExcel = () => {
    if (submittedReports.length === 0) {
      alert("No reports to download")
      return
    }

    const headers = [
      "ID",
      "District",
      "Mandi",
      "Crop",
      "Price (₹/qtl)",
      "Quantity (qtl)",
      "Date",
      "Status",
      "Submitted At",
    ]
    const tsvContent = [
      headers.join("\t"),
      ...submittedReports.map((report) =>
        [
          report.id,
          getDistrictDisplayName(report.district),
          getMandiDisplayName(report.district, report.mandi),
          getCropDisplayName(report.crop),
          report.price,
          report.quantity,
          report.date,
          report.status,
          new Date(report.submittedAt).toLocaleString("en-IN"),
        ].join("\t"),
      ),
    ].join("\n")

    const blob = new Blob([tsvContent], { type: "application/vnd.ms-excel" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `my-price-reports-${new Date().toISOString().split("T")[0]}.xls`
    link.click()
  }

  const bestMandi = useMemo(() => {
    if (mandiData.length === 0) return null
    return mandiData.reduce((best, current) => (current.price > best.price ? current : best), mandiData[0])
  }, [mandiData])

  // Add click handler to crop dropdown to show details
  const handleCropClick = (cropValue: string) => {
    setSelectedCropDetails(cropValue)
  }

  // Update districts and mandis when state changes
  const handleStateChange = (state: string) => {
    setSelectedState(state)
    if (state && indiaStatesDistricts[state as keyof typeof indiaStatesDistricts]) {
      const stateData = indiaStatesDistricts[state as keyof typeof indiaStatesDistricts]
      setAvailableDistricts(stateData.districts)
      setSelectedDistrict("") // Reset district when state changes
    }
  }

  // Update mandis when district changes
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-foreground/10 p-2">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AgriMandi</h1>
              <p className="text-sm text-primary-foreground/80">Agricultural Marketing Information System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedState}</span>
            </div>
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">{user.name}</span>
              <Badge variant="secondary" className="text-xs">
                Farmer
              </Badge>
            </div>
            <Button variant="secondary" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <Card className="mb-6 border-success/30 bg-success/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">Welcome, {user.name}!</h2>
              <p className="text-muted-foreground">Find the best mandi prices for your crops in Andhra Pradesh</p>
            </div>
            <div className="hidden gap-2 sm:flex">
              <Badge variant="outline" className="gap-1 border-success text-success">
                <CheckCircle className="h-3 w-3" />
                Verified Farmer
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                Trust Score: 85
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 gap-2 lg:grid-cols-8">
            <TabsTrigger value="find" className="gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Find Prices</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map View</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">My Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Find Best Mandi Price
                </CardTitle>
                <CardDescription>Select your crop and location to find the best prices across mandis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select value={selectedState} onValueChange={handleStateChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Object.keys(indiaStatesDistricts).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {availableDistricts.map((district) => (
                          <SelectItem key={district} value={district.toLowerCase().replace(/ /g, "_")}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Crop
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </Label>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.map((crop) => (
                          <SelectItem
                            key={crop.value}
                            value={crop.value}
                            onMouseDown={(e) => {
                              if (e.detail > 1) {
                                e.preventDefault()
                                handleCropClick(crop.value)
                              }
                            }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>
                                {crop.label} ({crop.telugu})
                              </span>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Double-click crop to see details</p>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={handleSearch} className="w-full gap-2" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Search Prices
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {showResults && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Mandi Prices</CardTitle>
                      <CardDescription>
                        Showing prices for {getCropDisplayName(selectedCrop)} in{" "}
                        {getDistrictDisplayName(selectedDistrict)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Updated: {lastUpdated}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Best Price Highlight */}
                  {bestMandi && (
                    <div className="mb-6 rounded-lg border-2 border-success bg-success/10 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-success text-success-foreground">Best Price</Badge>
                            <h3 className="text-lg font-semibold">{bestMandi.mandi}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{bestMandi.district}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-success">₹{bestMandi.price.toLocaleString("en-IN")}</p>
                          <p className="text-sm text-muted-foreground">{bestMandi.unit || "per quintal"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Table */}
                  {mandiData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-3 font-medium">Mandi</th>
                            <th className="pb-3 font-medium">Price (₹/qtl)</th>
                            <th className="pb-3 font-medium">Change</th>
                            <th className="pb-3 font-medium">Trust Score</th>
                            <th className="pb-3 font-medium">Distance</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mandiData.map((item, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-4">
                                <div>
                                  <p className="font-medium">{item.mandi}</p>
                                  <p className="text-sm text-muted-foreground">{item.district}</p>
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="h-4 w-4" />
                                  <span className="text-lg font-semibold">{item.price.toLocaleString("en-IN")}</span>
                                </div>
                                {item.minPrice && item.maxPrice && (
                                  <p className="text-xs text-muted-foreground">
                                    Range: ₹{item.minPrice.toLocaleString("en-IN")} - ₹
                                    {item.maxPrice.toLocaleString("en-IN")}
                                  </p>
                                )}
                              </td>
                              <td className="py-4">
                                <div
                                  className={`flex items-center gap-1 ${item.change >= 0 ? "text-success" : "text-destructive"}`}
                                >
                                  {item.change >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                  )}
                                  <span>{Math.abs(item.change)}%</span>
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                                    <div
                                      className={`h-full rounded-full ${
                                        item.trustScore >= 80
                                          ? "bg-success"
                                          : item.trustScore >= 60
                                            ? "bg-warning"
                                            : "bg-destructive"
                                      }`}
                                      style={{ width: `${item.trustScore}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{item.trustScore}%</span>
                                  {item.verified && <Shield className="h-4 w-4 text-success" />}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{item.distance} km</span>
                                </div>
                              </td>
                              <td className="py-4">
                                {item.verified ? (
                                  <Badge variant="outline" className="gap-1 border-success text-success">
                                    <CheckCircle className="h-3 w-3" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1">
                                    <Clock className="h-3 w-3" />
                                    Pending
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-lg font-medium text-muted-foreground">No prices found</p>
                      <p className="text-sm text-muted-foreground">Try selecting a different crop or district</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Map View Tab */}
          <TabsContent value="map">
            <MandiMapView />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <PriceTrendAnalysis />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <PriceAlerts />
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare">
            <MandiComparison />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Report Price Tab */}
          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Report Your Selling Price
                </CardTitle>
                <CardDescription>Help other farmers by sharing your actual selling price with proof</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formErrors.length > 0 && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Please fix the following errors:</span>
                    </div>
                    <ul className="mt-2 list-inside list-disc text-sm text-destructive">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      District <span className="text-destructive">*</span>
                    </Label>
                    <Select value={reportDistrict} onValueChange={setReportDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Using availableDistricts which is populated based on selectedState */}
                        {availableDistricts.map((district) => (
                          <SelectItem key={district} value={district.toLowerCase().replace(/ /g, "_")}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Mandi <span className="text-destructive">*</span>
                    </Label>
                    <Select value={reportMandi} onValueChange={setReportMandi} disabled={!reportDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder={reportDistrict ? "Select Mandi" : "Select District First"} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Mandis are now dynamically fetched or handled by backend based on district */}
                        {reportDistrict &&
                          indiaStatesDistricts[selectedState as keyof typeof indiaStatesDistricts]?.mandis?.[
                            reportDistrict
                          ]?.map((mandi) => (
                            <SelectItem key={mandi.value} value={mandi.value}>
                              {mandi.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Crop <span className="text-destructive">*</span>
                    </Label>
                    <Select value={reportCrop} onValueChange={setReportCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.map((crop) => (
                          <SelectItem key={crop.value} value={crop.value}>
                            {crop.label} ({crop.telugu})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Selling Price (₹ per quintal) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter selling price"
                      value={reportPrice}
                      onChange={(e) => setReportPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Quantity (quintals) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity sold"
                      value={reportQuantity}
                      onChange={(e) => setReportQuantity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Transaction Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload Bill/Receipt (Optional)</Label>
                  <div
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-primary hover:bg-primary/5 ${
                      selectedFile ? "border-success bg-success/5" : "border-muted-foreground/25"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="space-y-3">
                        {uploadedFilePreview ? (
                          <div className="relative mx-auto h-32 w-32">
                            <img
                              src={uploadedFilePreview || "/placeholder.svg"}
                              alt="Receipt preview"
                              className="h-full w-full rounded-lg object-cover"
                            />
                          </div>
                        ) : (
                          <FileText className="mx-auto h-12 w-12 text-success" />
                        )}
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <span className="font-medium text-success">{selectedFile.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearSelectedFile()
                          }}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <Button onClick={handleSubmitReport} className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Submit Price Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      My Submitted Reports
                    </CardTitle>
                    <CardDescription>Track the status of your submitted price reports</CardDescription>
                  </div>
                  {submittedReports.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadAsCSV} className="gap-1 bg-transparent">
                        <Download className="h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadAsExcel} className="gap-1 bg-transparent">
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {submittedReports.length > 0 ? (
                  <div className="space-y-4">
                    {submittedReports.map((report) => (
                      <div key={report.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{getCropDisplayName(report.crop)}</h4>
                              <Badge
                                variant={
                                  report.status === "approved"
                                    ? "default"
                                    : report.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={report.status === "approved" ? "bg-success" : ""}
                              >
                                {report.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                                {report.status === "rejected" && <X className="mr-1 h-3 w-3" />}
                                {report.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getMandiDisplayName(report.district, report.mandi)},{" "}
                              {getDistrictDisplayName(report.district)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">₹{report.price.toLocaleString("en-IN")}</p>
                            <p className="text-sm text-muted-foreground">{report.quantity} quintals</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {report.date}
                          </span>
                          {report.receiptName && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {report.receiptName}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-muted-foreground">No reports submitted yet</p>
                    <p className="text-sm text-muted-foreground">
                      Submit your first price report to help other farmers
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <CropDetailsModal
        crop={selectedCropDetails ? cropDatabase[selectedCropDetails] : null}
        open={!!selectedCropDetails}
        onClose={() => setSelectedCropDetails(null)}
      />

      <VoiceAssistant activeTab={activeTab} />
    </div>
  )
}
