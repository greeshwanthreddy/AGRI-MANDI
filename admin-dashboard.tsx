"use client"

import { useState, useEffect } from "react"
import type { User } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  LogOut,
  Shield,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  Building2,
  Package,
  Eye,
  Ban,
  FileText,
  Download,
  Clock,
  IndianRupee,
  ImageIcon,
} from "lucide-react"

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

interface FarmerReport {
  id: number
  farmerName: string
  farmerEmail: string
  district: string
  mandi: string
  crop: string
  price: number
  quantity: number
  date: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  receiptUrl?: string
}

const pendingOfficials = [
  { id: 1, name: "Vikram Singh", mandi: "Ratlam Mandi", email: "vikram@ratlam.gov", applied: "2025-12-05" },
  { id: 2, name: "Anita Desai", mandi: "Ujjain Mandi", email: "anita@ujjain.gov", applied: "2025-12-07" },
  { id: 3, name: "Prakash Yadav", mandi: "Sagar Mandi", email: "prakash@sagar.gov", applied: "2025-12-08" },
]

const verifiedOfficials = [
  {
    id: 1,
    name: "Suresh Sharma",
    mandi: "Indore Mandi",
    email: "suresh@indore.gov",
    verified: "2025-11-15",
    status: "active",
  },
  {
    id: 2,
    name: "Meena Patel",
    mandi: "Dewas Mandi",
    email: "meena@dewas.gov",
    verified: "2025-10-20",
    status: "active",
  },
  {
    id: 3,
    name: "Rajiv Kumar",
    mandi: "Bhopal Mandi",
    email: "rajiv@bhopal.gov",
    verified: "2025-09-10",
    status: "suspended",
  },
]

const flaggedReports = [
  {
    id: 1,
    type: "Fake Price",
    reporter: "System",
    mandi: "Ujjain Mandi",
    crop: "Wheat",
    issue: "Price 50% below market average",
    date: "2025-12-08",
  },
  {
    id: 2,
    type: "Duplicate",
    reporter: "Farmer",
    mandi: "Indore Mandi",
    crop: "Rice",
    issue: "Same report submitted multiple times",
    date: "2025-12-07",
  },
  {
    id: 3,
    type: "Suspicious",
    reporter: "System",
    mandi: "Ratlam Mandi",
    crop: "Cotton",
    issue: "Unusual price spike detected",
    date: "2025-12-07",
  },
]

const mandis = [
  { id: 1, name: "Indore Mandi", state: "Madhya Pradesh", official: "Suresh Sharma", trustScore: 92, status: "active" },
  { id: 2, name: "Dewas Mandi", state: "Madhya Pradesh", official: "Meena Patel", trustScore: 88, status: "active" },
  { id: 3, name: "Ujjain Mandi", state: "Madhya Pradesh", official: "Pending", trustScore: 78, status: "unverified" },
  { id: 4, name: "Bhopal Mandi", state: "Madhya Pradesh", official: "Rajiv Kumar", trustScore: 95, status: "active" },
]

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const [farmerReports, setFarmerReports] = useState<FarmerReport[]>([])
  const [reportFilter, setReportFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  useEffect(() => {
    const loadReports = () => {
      const storedReports = localStorage.getItem("farmerReports")
      if (storedReports) {
        const reports = JSON.parse(storedReports)
        setFarmerReports(reports)
      } else {
        // Default sample reports if none exist
        const sampleReports: FarmerReport[] = [
          {
            id: 1,
            farmerName: "Ramesh Kumar",
            farmerEmail: "ramesh@example.com",
            district: "East Godavari",
            mandi: "Kakinada",
            crop: "Rice (వరి)",
            price: 2150,
            quantity: 50,
            date: "2025-12-10",
            submittedAt: "2025-12-10T10:30:00",
            status: "pending",
          },
          {
            id: 2,
            farmerName: "Lakshmi Devi",
            farmerEmail: "lakshmi@example.com",
            district: "West Godavari",
            mandi: "Eluru",
            crop: "Cotton (పత్తి)",
            price: 6800,
            quantity: 30,
            date: "2025-12-09",
            submittedAt: "2025-12-09T14:15:00",
            status: "pending",
          },
          {
            id: 3,
            farmerName: "Venkat Rao",
            farmerEmail: "venkat@example.com",
            district: "East Godavari",
            mandi: "Rajahmundry",
            crop: "Groundnut (వేరుశెనగ)",
            price: 5600,
            quantity: 25,
            date: "2025-12-08",
            submittedAt: "2025-12-08T09:45:00",
            status: "approved",
          },
        ]
        setFarmerReports(sampleReports)
        localStorage.setItem("farmerReports", JSON.stringify(sampleReports))
      }
    }
    loadReports()
  }, [])

  const handleApproveReport = (reportId: number) => {
    const updatedReports = farmerReports.map((report) =>
      report.id === reportId ? { ...report, status: "approved" as const } : report,
    )
    setFarmerReports(updatedReports)
    localStorage.setItem("farmerReports", JSON.stringify(updatedReports))
  }

  const handleRejectReport = (reportId: number) => {
    const updatedReports = farmerReports.map((report) =>
      report.id === reportId ? { ...report, status: "rejected" as const } : report,
    )
    setFarmerReports(updatedReports)
    localStorage.setItem("farmerReports", JSON.stringify(updatedReports))
  }

  const handleDeleteReport = (reportId: number) => {
    const updatedReports = farmerReports.filter((report) => report.id !== reportId)
    setFarmerReports(updatedReports)
    localStorage.setItem("farmerReports", JSON.stringify(updatedReports))
  }

  const filteredReports = farmerReports.filter((report) => {
    if (reportFilter === "all") return true
    return report.status === reportFilter
  })

  const downloadReportsCSV = () => {
    const headers = [
      "ID",
      "Farmer Name",
      "Email",
      "District",
      "Mandi",
      "Crop",
      "Price (₹/Quintal)",
      "Quantity (Quintals)",
      "Date",
      "Status",
    ]
    const csvContent = [
      headers.join(","),
      ...farmerReports.map((r) =>
        [
          r.id,
          r.farmerName,
          r.farmerEmail,
          r.district,
          r.mandi,
          `"${r.crop}"`,
          r.price,
          r.quantity,
          r.date,
          r.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `farmer-reports-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const stats = {
    totalMandis: mandis.length,
    verifiedOfficials: verifiedOfficials.filter((o) => o.status === "active").length,
    pendingApprovals: pendingOfficials.length,
    flaggedReports: flaggedReports.length,
    pendingFarmerReports: farmerReports.filter((r) => r.status === "pending").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-destructive rounded-lg">
              <Shield className="h-5 w-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AgriMandi</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="hidden md:flex">
              Admin Access
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
        {/* Stats - Updated with farmer reports stat */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMandis}</p>
                  <p className="text-xs text-muted-foreground">Total Mandis</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.verifiedOfficials}</p>
                  <p className="text-xs text-muted-foreground">Active Officials</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</p>
                  <p className="text-xs text-muted-foreground">Pending Officials</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingFarmerReports}</p>
                  <p className="text-xs text-muted-foreground">Pending Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.flaggedReports}</p>
                  <p className="text-xs text-muted-foreground">Flagged Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="farmer-reports" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="farmer-reports" className="gap-2">
              <FileText className="h-4 w-4" />
              Farmer Reports
            </TabsTrigger>
            <TabsTrigger value="verify-officials" className="gap-2">
              <Shield className="h-4 w-4" />
              Verify Officials
            </TabsTrigger>
            <TabsTrigger value="manage-mandis" className="gap-2">
              <Building2 className="h-4 w-4" />
              Manage Mandis
            </TabsTrigger>
            <TabsTrigger value="flagged-data" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Flagged Data
            </TabsTrigger>
            <TabsTrigger value="commodities" className="gap-2">
              <Package className="h-4 w-4" />
              Commodities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farmer-reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Farmer Price Reports
                    </CardTitle>
                    <CardDescription>Review and approve price reports submitted by farmers</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={downloadReportsCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={reportFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReportFilter("all")}
                  >
                    All ({farmerReports.length})
                  </Button>
                  <Button
                    variant={reportFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReportFilter("pending")}
                    className={reportFilter === "pending" ? "" : "border-warning text-warning hover:bg-warning/10"}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Pending ({farmerReports.filter((r) => r.status === "pending").length})
                  </Button>
                  <Button
                    variant={reportFilter === "approved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReportFilter("approved")}
                    className={
                      reportFilter === "approved"
                        ? "bg-success hover:bg-success/90"
                        : "border-success text-success hover:bg-success/10"
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approved ({farmerReports.filter((r) => r.status === "approved").length})
                  </Button>
                  <Button
                    variant={reportFilter === "rejected" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReportFilter("rejected")}
                    className={
                      reportFilter === "rejected"
                        ? "bg-destructive hover:bg-destructive/90"
                        : "border-destructive text-destructive hover:bg-destructive/10"
                    }
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejected ({farmerReports.filter((r) => r.status === "rejected").length})
                  </Button>
                </div>

                {/* Reports list */}
                <div className="space-y-4">
                  {filteredReports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No reports found</p>
                    </div>
                  ) : (
                    filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg ${
                          report.status === "pending"
                            ? "border-warning/30 bg-warning/5"
                            : report.status === "approved"
                              ? "border-success/30 bg-success/5"
                              : "border-destructive/30 bg-destructive/5"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  report.status === "pending"
                                    ? "secondary"
                                    : report.status === "approved"
                                      ? "default"
                                      : "destructive"
                                }
                                className={report.status === "approved" ? "bg-success" : ""}
                              >
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                              <span className="text-sm text-muted-foreground">ID: #{report.id}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Farmer</p>
                                <p className="font-medium text-foreground">{report.farmerName}</p>
                                <p className="text-sm text-muted-foreground">{report.farmerEmail}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="font-medium text-foreground">{report.mandi}</p>
                                <p className="text-sm text-muted-foreground">{report.district}, Andhra Pradesh</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Crop</p>
                                <p className="font-medium text-foreground">{report.crop}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-medium text-foreground flex items-center">
                                  <IndianRupee className="h-4 w-4" />
                                  {report.price.toLocaleString()}/Quintal
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Quantity</p>
                                <p className="font-medium text-foreground">{report.quantity} Quintals</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Transaction Date</p>
                                <p className="font-medium text-foreground">{report.date}</p>
                              </div>
                            </div>

                            {report.receiptUrl && (
                              <div className="mt-3 flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={report.receiptUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  View Receipt/Bill
                                </a>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground mt-2">
                              Submitted: {new Date(report.submittedAt).toLocaleString()}
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-row md:flex-col gap-2">
                            {report.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-success hover:bg-success/90"
                                  onClick={() => handleApproveReport(report.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleRejectReport(report.id)}>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {report.status !== "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const updatedReports = farmerReports.map((r) =>
                                    r.id === report.id ? { ...r, status: "pending" as const } : r,
                                  )
                                  setFarmerReports(updatedReports)
                                  localStorage.setItem("farmerReports", JSON.stringify(updatedReports))
                                }}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Reset
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDeleteReport(report.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify-officials" className="space-y-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Pending Official Approvals
                </CardTitle>
                <CardDescription>Review and verify market officials before granting access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOfficials.map((official) => (
                    <div
                      key={official.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-warning/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{official.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {official.mandi} • {official.email}
                          </p>
                          <p className="text-xs text-muted-foreground">Applied: {official.applied}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-success hover:bg-success/90">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Verified Officials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Verified Officials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mandi</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Verified</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifiedOfficials.map((official) => (
                        <tr key={official.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-foreground">{official.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{official.mandi}</td>
                          <td className="py-3 px-4 text-muted-foreground">{official.email}</td>
                          <td className="py-3 px-4 text-muted-foreground">{official.verified}</td>
                          <td className="py-3 px-4">
                            <Badge variant={official.status === "active" ? "default" : "destructive"}>
                              {official.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Ban className="h-4 w-4" />
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

          <TabsContent value="manage-mandis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Manage Mandis
                    </CardTitle>
                    <CardDescription>Add, edit, or remove mandis from the system</CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Mandi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mandis..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mandi</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">State</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Official</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trust Score</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mandis.map((mandi) => (
                        <tr key={mandi.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{mandi.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{mandi.state}</td>
                          <td className="py-3 px-4 text-muted-foreground">{mandi.official}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    mandi.trustScore >= 90
                                      ? "bg-success"
                                      : mandi.trustScore >= 80
                                        ? "bg-warning"
                                        : "bg-destructive"
                                  }`}
                                  style={{ width: `${mandi.trustScore}%` }}
                                />
                              </div>
                              <span className="text-sm">{mandi.trustScore}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                mandi.status === "active"
                                  ? "default"
                                  : mandi.status === "unverified"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {mandi.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flagged-data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Flagged Reports
                </CardTitle>
                <CardDescription>Review and take action on suspicious or fake data reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">{report.type}</Badge>
                            <span className="text-sm text-muted-foreground">Reported by: {report.reporter}</span>
                          </div>
                          <p className="font-medium text-foreground mt-1">
                            {report.mandi} - {report.crop}
                          </p>
                          <p className="text-sm text-muted-foreground">{report.issue}</p>
                          <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-success border-success hover:bg-success/10 bg-transparent"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commodities" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Manage Commodities
                    </CardTitle>
                    <CardDescription>Add or manage the list of commodities tracked in the system</CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Commodity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Wheat",
                    "Rice",
                    "Cotton",
                    "Soybean",
                    "Maize",
                    "Onion",
                    "Tomato",
                    "Potato",
                    "Gram",
                    "Mustard",
                    "Groundnut",
                    "Sugarcane",
                  ].map((crop) => (
                    <div key={crop} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{crop}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
