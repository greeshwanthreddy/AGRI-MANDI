"use client"

import type React from "react"

import { useState } from "react"
import type { User, UserRole } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Users, Shield, Eye, EyeOff, MapPin } from "lucide-react"

interface LoginPageProps {
  onLogin: (user: User) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as UserRole,
    location: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const demoUsers: Record<string, User> = {
      "farmer@demo.com": { name: "Rajesh Kumar", email: "farmer@demo.com", role: "farmer", location: "Andhra Pradesh" },
      "mandi@demo.com": {
        name: "Suresh Sharma",
        email: "mandi@demo.com",
        role: "mandi_owner",
        location: "East Godavari",
      },
      "admin@demo.com": { name: "Admin User", email: "admin@demo.com", role: "admin" },
    }
    const user = demoUsers[loginData.email]
    if (user) {
      onLogin(user)
    } else {
      // In real app would verify credentials against database
      if (loginData.email && loginData.password) {
        onLogin({
          name: loginData.email.split("@")[0] || loginData.email, // Use email username or full email as name
          email: loginData.email,
          role: "farmer", // Default to farmer for custom logins
          location: "Andhra Pradesh",
        })
      } else {
        alert("Please enter email and password. Demo accounts: farmer@demo.com, mandi@demo.com, or admin@demo.com")
      }
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.role) {
      onLogin({
        name: registerData.name,
        email: registerData.email,
        role: registerData.role,
        location: registerData.location,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Leaf className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AgriMandi</h1>
              <p className="text-xs text-muted-foreground">Agricultural Marketing Platform</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#" className="text-foreground font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Price Reports
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Market Profile
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Helpdesk
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contact Us
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="/indian-agricultural-crops-grains-wheat-rice-colorf.jpg"
          alt="Agricultural crops"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 flex items-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">AgriMandi</h2>
            <p className="text-xl text-primary-foreground/90">Agricultural Marketing Information System</p>
            <p className="text-primary-foreground/80 mt-2 max-w-xl">
              Find the best mandi prices for your crops with trust scores and real farmer reports
            </p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Cards */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Welcome to AgriMandi Portal</h3>
            <p className="text-muted-foreground">
              A unified platform where farmers can find the best mandi prices, mandi owners can update daily rates, and
              administrators ensure data integrity.
            </p>

            <div className="grid gap-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">For Farmers</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter your location and crop to find which nearby mandi offers the best price today with trust
                      scores.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">For Mandi Owners</h4>
                    <p className="text-sm text-muted-foreground">
                      Update daily prices, manage arrivals, and build trust with accurate reporting.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">For Administrators</h4>
                    <p className="text-sm text-muted-foreground">
                      Verify officials, remove fake data, and manage mandis and commodities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Login/Register Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Access Portal</CardTitle>
              <CardDescription>Login or register to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email / Username</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Login
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Demo: farmer@demo.com, mandi@demo.com, or admin@demo.com
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">I am a</Label>
                      <Select onValueChange={(value) => setRegisterData({ ...registerData, role: value as UserRole })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer / Seller</SelectItem>
                          <SelectItem value="mandi_owner">Mandi Owner / Buyer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location / State</Label>
                      <Input
                        id="location"
                        placeholder="Enter your location"
                        value={registerData.location}
                        onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Register
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">AgriMandi - Agricultural Marketing Information System</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
