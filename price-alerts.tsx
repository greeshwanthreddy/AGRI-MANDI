"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Bell, TrendingDown, TrendingUp, Shield, X, Plus, CheckCircle } from "lucide-react"

interface Alert {
  id: string
  type: "deviation" | "fake" | "custom"
  severity: "high" | "medium" | "low"
  crop: string
  mandi: string
  message: string
  timestamp: string
  currentPrice: number
  expectedPrice: number
  deviation: number
  isRead: boolean
}

interface CustomAlert {
  id: string
  crop: string
  condition: "above" | "below"
  price: number
  enabled: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "deviation",
    severity: "high",
    crop: "Rice (వరి)",
    mandi: "Kakinada",
    message: "Price dropped significantly below 7-day average",
    timestamp: "2025-12-11T09:30:00",
    currentPrice: 2150,
    expectedPrice: 2450,
    deviation: -12.2,
    isRead: false,
  },
  {
    id: "2",
    type: "fake",
    severity: "high",
    crop: "Chillies (మిర్చి)",
    mandi: "Rajahmundry",
    message: "Suspected price manipulation detected - Price unusually high compared to nearby mandis",
    timestamp: "2025-12-11T08:45:00",
    currentPrice: 18500,
    expectedPrice: 12000,
    deviation: 54.2,
    isRead: false,
  },
  {
    id: "3",
    type: "deviation",
    severity: "medium",
    crop: "Cotton (పత్తి)",
    mandi: "Eluru",
    message: "Price increased above normal range",
    timestamp: "2025-12-11T07:15:00",
    currentPrice: 7200,
    expectedPrice: 6500,
    deviation: 10.8,
    isRead: true,
  },
  {
    id: "4",
    type: "fake",
    severity: "medium",
    crop: "Groundnut (వేరుశనగ)",
    mandi: "Bhimavaram",
    message: "Multiple reports from same source with identical prices - Possible data duplication",
    timestamp: "2025-12-10T16:30:00",
    currentPrice: 5800,
    expectedPrice: 5800,
    deviation: 0,
    isRead: true,
  },
  {
    id: "5",
    type: "deviation",
    severity: "low",
    crop: "Turmeric (పసుపు)",
    mandi: "Samalkot",
    message: "Minor price fluctuation detected",
    timestamp: "2025-12-10T14:20:00",
    currentPrice: 8700,
    expectedPrice: 8500,
    deviation: 2.4,
    isRead: true,
  },
]

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterType, setFilterType] = useState("all")

  // New custom alert form
  const [newAlertCrop, setNewAlertCrop] = useState("")
  const [newAlertCondition, setNewAlertCondition] = useState<"above" | "below">("above")
  const [newAlertPrice, setNewAlertPrice] = useState("")

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) return false
    if (filterType !== "all" && alert.type !== filterType) return false
    return true
  })

  const unreadCount = alerts.filter((a) => !a.isRead).length

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)))
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })))
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const addCustomAlert = () => {
    if (!newAlertCrop || !newAlertPrice) return
    const newAlert: CustomAlert = {
      id: Date.now().toString(),
      crop: newAlertCrop,
      condition: newAlertCondition,
      price: Number(newAlertPrice),
      enabled: true,
    }
    setCustomAlerts((prev) => [...prev, newAlert])
    setNewAlertCrop("")
    setNewAlertPrice("")
  }

  const toggleCustomAlert = (id: string) => {
    setCustomAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
  }

  const deleteCustomAlert = (id: string) => {
    setCustomAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "low":
        return <Bell className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <span className="font-semibold">Price Alerts</span>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} new</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            <span className="text-sm text-muted-foreground">
              {notificationsEnabled ? "Notifications On" : "Notifications Off"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deviation">Deviation</SelectItem>
              <SelectItem value="fake">Fake Detection</SelectItem>
            </SelectContent>
          </Select>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Active Alerts ({filteredAlerts.length})
              </CardTitle>
              <CardDescription>Real-time price deviation and anomaly alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No alerts matching your filters</p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${!alert.isRead ? "bg-primary/5 border-primary/20" : "bg-card"} ${getSeverityColor(alert.severity)}`}
                    onClick={() => markAsRead(alert.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{alert.crop}</span>
                            <Badge variant="outline" className="text-xs">
                              {alert.mandi}
                            </Badge>
                            {alert.type === "fake" && (
                              <Badge variant="destructive" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Suspicious
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{alert.message}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>
                              Current: <strong className="text-primary">₹{alert.currentPrice}</strong>
                            </span>
                            <span>
                              Expected: <strong>₹{alert.expectedPrice}</strong>
                            </span>
                            <span
                              className={`flex items-center gap-1 ${alert.deviation > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {alert.deviation > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {alert.deviation > 0 ? "+" : ""}
                              {alert.deviation.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          dismissAlert(alert.id)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Fake Price Detection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Fake Price Detection System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Anomaly Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes price patterns to identify unusual spikes or drops that deviate from market trends.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Cross-Mandi Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Prices are compared across nearby mandis to detect localized manipulation attempts.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Source Validation</h4>
                  <p className="text-sm text-muted-foreground">
                    Reports from verified officials receive higher trust scores than unverified sources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Custom Price Alerts
            </CardTitle>
            <CardDescription>Set your own price thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label>Crop</Label>
                <Select value={newAlertCrop} onValueChange={setNewAlertCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rice (వరి)">Rice (వరి)</SelectItem>
                    <SelectItem value="Cotton (పత్తి)">Cotton (పత్తి)</SelectItem>
                    <SelectItem value="Groundnut (వేరుశనగ)">Groundnut (వేరుశనగ)</SelectItem>
                    <SelectItem value="Chillies (మిర్చి)">Chillies (మిర్చి)</SelectItem>
                    <SelectItem value="Turmeric (పసుపు)">Turmeric (పసుపు)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Condition</Label>
                  <Select value={newAlertCondition} onValueChange={(v: "above" | "below") => setNewAlertCondition(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="2500"
                    value={newAlertPrice}
                    onChange={(e) => setNewAlertPrice(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={addCustomAlert} disabled={!newAlertCrop || !newAlertPrice}>
                <Plus className="h-4 w-4 mr-2" />
                Add Alert
              </Button>
            </div>

            <div className="border-t pt-4 space-y-2">
              <h4 className="font-medium text-sm">Your Alerts ({customAlerts.length})</h4>
              {customAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No custom alerts set</p>
              ) : (
                customAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Switch checked={alert.enabled} onCheckedChange={() => toggleCustomAlert(alert.id)} />
                      <div>
                        <p className="text-sm font-medium">{alert.crop}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.condition === "above" ? "Above" : "Below"} ₹{alert.price}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteCustomAlert(alert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
