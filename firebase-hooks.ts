"use client"

import { useState, useEffect } from "react"
import type { User as FirebaseUser } from "firebase/auth"
import {
  onAuthChange,
  getUserProfile,
  type UserProfile,
  getPriceReports,
  type PriceReport,
  getUserAlerts,
  type PriceAlert,
} from "./firebase"

// Hook to track authentication state
export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        const { profile } = await getUserProfile(firebaseUser.uid)
        setProfile(profile)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, profile, loading }
}

// Hook to fetch user's price reports
export function useUserReports(userId: string | undefined) {
  const [reports, setReports] = useState<PriceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setReports([])
      setLoading(false)
      return
    }

    const fetchReports = async () => {
      setLoading(true)
      const { reports, error } = await getPriceReports({ farmerId: userId })
      setReports(reports)
      setError(error)
      setLoading(false)
    }

    fetchReports()
  }, [userId])

  const refetch = async () => {
    if (!userId) return
    setLoading(true)
    const { reports, error } = await getPriceReports({ farmerId: userId })
    setReports(reports)
    setError(error)
    setLoading(false)
  }

  return { reports, loading, error, refetch }
}

// Hook to fetch user's price alerts
export function useUserAlerts(userId: string | undefined) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setAlerts([])
      setLoading(false)
      return
    }

    const fetchAlerts = async () => {
      setLoading(true)
      const { alerts, error } = await getUserAlerts(userId)
      setAlerts(alerts)
      setError(error)
      setLoading(false)
    }

    fetchAlerts()
  }, [userId])

  const refetch = async () => {
    if (!userId) return
    setLoading(true)
    const { alerts, error } = await getUserAlerts(userId)
    setAlerts(alerts)
    setError(error)
    setLoading(false)
  }

  return { alerts, loading, error, refetch }
}

// Hook to fetch all pending reports (for admin)
export function usePendingReports() {
  const [reports, setReports] = useState<PriceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      const { reports, error } = await getPriceReports({ status: "pending" })
      setReports(reports)
      setError(error)
      setLoading(false)
    }

    fetchReports()
  }, [])

  const refetch = async () => {
    setLoading(true)
    const { reports, error } = await getPriceReports({ status: "pending" })
    setReports(reports)
    setError(error)
    setLoading(false)
  }

  return { reports, loading, error, refetch }
}
