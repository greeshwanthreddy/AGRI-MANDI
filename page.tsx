"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/components/login-page"
import { FarmerDashboard } from "@/components/farmer-dashboard"
import { MandiOwnerDashboard } from "@/components/mandi-owner-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export type UserRole = "farmer" | "mandi_owner" | "admin" | null

export interface User {
  name: string
  email: string
  role: UserRole
  location?: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("agrimarketUser")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.log("[v0] Failed to parse saved user:", error)
        localStorage.removeItem("agrimarketUser")
      }
    }
    setIsHydrated(true)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("agrimarketUser", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("agrimarketUser")
  }

  if (!isHydrated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  switch (user.role) {
    case "farmer":
      return <FarmerDashboard user={user} onLogout={handleLogout} />
    case "mandi_owner":
      return <MandiOwnerDashboard user={user} onLogout={handleLogout} />
    case "admin":
      return <AdminDashboard user={user} onLogout={handleLogout} />
    default:
      return <LoginPage onLogin={handleLogin} />
  }
}
