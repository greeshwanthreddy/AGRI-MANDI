"use client"

import { useState } from "react"
import type { User } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  LogOut,
  Plus,
  Edit2,
  TrendingUp,
  Star,
  CheckCircle,
  Users,
  Package,
  BarChart3,
  Calendar,
  AlertTriangle,
  Download,
} from "lucide-react"

interface MandiOwnerDashboardProps {
  user: User
  onLogout: () => void
}

const crops = ["Wheat", "Rice", "Cotton", "Soybean", "Maize", "Onion", "Tomato", "Potato", "Gram", "Mustard"]

const todayPrices = [
  { crop: "Wheat", minPrice: 2300, maxPrice: 2500, modalPrice: 2420, arrivals: 450, updated: true },
  { crop: "Rice", minPrice: 3200, maxPrice: 3600, modalPrice: 3400, arrivals: 280, updated: true },
  { crop: "Soybean", minPrice: 4000, maxPrice: 4400, modalPrice: 4200, arrivals: 320, updated: false },
  { crop: "Cotton", minPrice: 6500, maxPrice: 7000, modalPrice: 6800, arrivals: 150, updated: true },
  { crop: "Onion", minPrice: 1800, maxPrice: 2200, modalPrice: 2000, arrivals: 520, updated: false },
]

const farmerReports = [
  { id: 1, farmer: "Ramesh Patel", crop: "Wheat", reportedPrice: 2380, date: "2025-12-08", status: "pending" },
  { id: 2, farmer: "Sunil Kumar", crop: "Soybean", reportedPrice: 4150, date: "2025-12-08", status: "verified" },
  { id: 3, farmer: "Priya Sharma", crop: "Cotton", reportedPrice: 6750, date: "2025-12-07", status: "disputed" },
  { id: 4, farmer: "Mohan Das", crop: "Rice", reportedPrice: 3350, date: "2025-12-07", status: "verified" },
]

export function MandiOwnerDashboard({ user, onLogout }: MandiOwnerDashboardProps) {
  const [editingCrop, setEditingCrop] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState({ min: "", max: "", modal: "", arrivals: "" })

  const stats = {
    totalArrivals: todayPrices.reduce((sum, p) => sum + p.arrivals, 0),
    cropsUpdated: todayPrices.filter((p) => p.updated).length,
    pendingReports: farmerReports.filter((r) => r.status === "pending").length,
    trustScore: 88,
  }

  // Download functions for reports as CSV and Excel
  const downloadFarmerReportsCSV = () => {
    const headers = ["Farmer Name", "Crop", "Reported Price (₹/qtl)", "Date", "Status"]
    const rows = farmerReports.map((report) => [
      report.farmer,
      report.crop,
      report.reportedPrice,
      report.date,
      report.status,
    ])

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.join(",") + "\n"
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `farmer-reports-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const downloadFarmerReportsExcel = () => {
    const headers = ["Farmer Name", "Crop", "Reported Price (₹/qtl)", "Date", "Status"]
    const rows = farmerReports.map((report) => [
      report.farmer,
      report.crop,
      report.reportedPrice,
      report.date,
      report.status,
    ])

    let excelContent = headers.join("\t") + "\n"
    rows.forEach((row) => {
      excelContent += row.join("\t") + "\n"
    })

    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `farmer-reports-${new Date().toISOString().split("T")[0]}.xls`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const downloadTodaysPricesCSV = () => {
    const headers = [
      "Commodity",
      "Min Price (₹/qtl)",
      "Max Price (₹/qtl)",
      "Modal Price (₹/qtl)",
      "Arrivals (qtl)",
      "Status",
    ]
    const rows = todayPrices.map((item) => [
      item.crop,
      item.minPrice,
      item.maxPrice,
      item.modalPrice,
      item.arrivals,
      item.updated ? "Updated" : "Pending",
    ])

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.join(",") + "\n"
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `todays-prices-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const downloadTodaysPricesExcel = () => {
    const headers = [
      "Commodity",
      "Min Price (₹/qtl)",
      "Max Price (₹/qtl)",
      "Modal Price (₹/qtl)",
      "Arrivals (qtl)",
      "Status",
    ]
    const rows = todayPrices.map((item) => [
      item.crop,
      item.minPrice,
      item.maxPrice,
      item.modalPrice,
      item.arrivals,
      item.updated ? "Updated" : "Pending",
    ])

    let excelContent = headers.join("\t") + "\n"
    rows.forEach((row) => {
      excelContent += row.join("\t") + "\n"
    })

    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `todays-prices-${new Date().toISOString().split("T")[0]}.xls`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
              <Leaf className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AgriMandi</h1>
              <p className="text-xs text-muted-foreground">Mandi Owner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden md:flex items-center gap-1">
              <Star className="h-3 w-3 text-warning fill-warning" />
              Trust Score: {stats.trustScore}%
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalArrivals}</p>
                  <p className="text-xs text-muted-foreground">Total Arrivals (qtl)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.cropsUpdated}/{todayPrices.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Prices Updated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingReports}</p>
                  <p className="text-xs text-muted-foreground">Pending Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.trustScore}%</p>
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="update-prices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="update-prices" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Update Prices
            </TabsTrigger>
            <TabsTrigger value="farmer-reports" className="gap-2">
              <Users className="h-4 w-4" />
              Farmer Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="update-prices" className="space-y-6">
            {/* Add New Price */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Update Daily Prices
                </CardTitle>
                <CardDescription>Update today's prices for commodities at your mandi</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label>Commodity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          {crops.map((crop) => (
                            <SelectItem key={crop} value={crop}>
                              {crop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Min Price (₹/qtl)</Label>
                      <Input type="number" placeholder="Min" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Price (₹/qtl)</Label>
                      <Input type="number" placeholder="Max" />
                    </div>
                    <div className="space-y-2">
                      <Label>Modal Price (₹/qtl)</Label>
                      <Input type="number" placeholder="Modal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Arrivals (qtl)</Label>
                      <Input type="number" placeholder="Quantity" />
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Update Price
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Today's Prices */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Prices - {user.location}
                    </CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  {/* Download buttons for prices */}
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadTodaysPricesCSV}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      onClick={downloadTodaysPricesExcel}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Commodity</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Min Price</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Max Price</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Modal Price</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Arrivals</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayPrices.map((item, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-foreground">{item.crop}</td>
                          <td className="py-3 px-4 text-muted-foreground">₹{item.minPrice}</td>
                          <td className="py-3 px-4 text-muted-foreground">₹{item.maxPrice}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-foreground">₹{item.modalPrice}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{item.arrivals} qtl</td>
                          <td className="py-3 px-4">
                            {item.updated ? (
                              <Badge variant="outline" className="text-success border-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Updated
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-warning border-warning">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmer-reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Farmer Price Reports
                    </CardTitle>
                    <CardDescription>Review and verify price reports submitted by farmers</CardDescription>
                  </div>
                  {/* Download buttons for farmer reports */}
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadFarmerReportsCSV}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      onClick={downloadFarmerReportsExcel}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.farmer}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.crop} • {report.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">₹{report.reportedPrice}/qtl</p>
                          <p className="text-xs text-muted-foreground">Reported Price</p>
                        </div>
                        <Badge
                          variant={
                            report.status === "verified"
                              ? "default"
                              : report.status === "disputed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {report.status}
                        </Badge>
                        {report.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-success border-success hover:bg-success/10 bg-transparent"
                            >
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
                            >
                              Dispute
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Arrivals Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Arrivals chart will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>Price trends will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
