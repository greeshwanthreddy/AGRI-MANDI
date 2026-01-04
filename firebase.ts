// Firebase configuration and initialization
// To use Firebase, add these environment variables to your project:
// - NEXT_PUBLIC_FIREBASE_API_KEY
// - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
// - NEXT_PUBLIC_FIREBASE_PROJECT_ID
// - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
// - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
// - NEXT_PUBLIC_FIREBASE_APP_ID

import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Initialize Analytics (only on client side)
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported()
    if (supported) {
      return getAnalytics(app)
    }
  }
  return null
}

// ==================== AUTH FUNCTIONS ====================

export const firebaseSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const firebaseSignUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const firebaseSignOut = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// ==================== FIRESTORE FUNCTIONS ====================

// Users Collection
export interface UserProfile {
  uid: string
  email: string
  name: string
  role: "farmer" | "mandi_owner" | "admin"
  phone?: string
  location?: string
  district?: string
  state?: string
  trustScore?: number
  verified?: boolean
  createdAt: Date
  updatedAt: Date
}

export const createUserProfile = async (profile: UserProfile) => {
  try {
    await setDoc(doc(db, "users", profile.uid), {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt),
      updatedAt: Timestamp.fromDate(profile.updatedAt),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const getUserProfile = async (uid: string) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid))
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        profile: {
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as UserProfile,
        error: null,
      }
    }
    return { profile: null, error: "User not found" }
  } catch (error: any) {
    return { profile: null, error: error.message }
  }
}

// Price Reports Collection
export interface PriceReport {
  id?: string
  farmerId: string
  farmerName: string
  district: string
  mandi: string
  crop: string
  cropDisplay: string
  price: number
  quantity: number
  transactionDate: Date
  receiptUrl?: string
  status: "pending" | "approved" | "rejected"
  verifiedBy?: string
  verifiedAt?: Date
  trustScore?: number
  anomalyFlag?: boolean
  anomalyReason?: string
  createdAt: Date
  updatedAt: Date
}

export const submitPriceReport = async (report: Omit<PriceReport, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "priceReports"), {
      ...report,
      transactionDate: Timestamp.fromDate(report.transactionDate),
      createdAt: Timestamp.fromDate(report.createdAt),
      updatedAt: Timestamp.fromDate(report.updatedAt),
      verifiedAt: report.verifiedAt ? Timestamp.fromDate(report.verifiedAt) : null,
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getPriceReports = async (filters?: {
  farmerId?: string
  district?: string
  mandi?: string
  crop?: string
  status?: string
  limitCount?: number
}) => {
  try {
    const q = collection(db, "priceReports")
    const constraints: any[] = []

    if (filters?.farmerId) {
      constraints.push(where("farmerId", "==", filters.farmerId))
    }
    if (filters?.district) {
      constraints.push(where("district", "==", filters.district))
    }
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status))
    }

    constraints.push(orderBy("createdAt", "desc"))

    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount))
    }

    const querySnapshot = await getDocs(query(q, ...constraints))
    const reports: PriceReport[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      reports.push({
        id: doc.id,
        ...data,
        transactionDate: data.transactionDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        verifiedAt: data.verifiedAt?.toDate(),
      } as PriceReport)
    })

    return { reports, error: null }
  } catch (error: any) {
    return { reports: [], error: error.message }
  }
}

export const updatePriceReportStatus = async (
  reportId: string,
  status: "approved" | "rejected",
  verifiedBy: string,
) => {
  try {
    await updateDoc(doc(db, "priceReports", reportId), {
      status,
      verifiedBy,
      verifiedAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deletePriceReport = async (reportId: string) => {
  try {
    await deleteDoc(doc(db, "priceReports", reportId))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Mandi Prices Collection (Official Prices)
export interface MandiPrice {
  id?: string
  mandi: string
  district: string
  state: string
  crop: string
  cropDisplay: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  priceChange: number
  arrivals: number
  tradedQty: number
  reportedBy: string
  verified: boolean
  date: Date
  createdAt: Date
  updatedAt: Date
}

export const addMandiPrice = async (price: Omit<MandiPrice, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "mandiPrices"), {
      ...price,
      date: Timestamp.fromDate(price.date),
      createdAt: Timestamp.fromDate(price.createdAt),
      updatedAt: Timestamp.fromDate(price.updatedAt),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getMandiPrices = async (filters: {
  crop: string
  district?: string
  mandi?: string
  date?: Date
}) => {
  try {
    const q = collection(db, "mandiPrices")
    const constraints: any[] = [where("crop", "==", filters.crop)]

    if (filters.district) {
      constraints.push(where("district", "==", filters.district))
    }
    if (filters.mandi) {
      constraints.push(where("mandi", "==", filters.mandi))
    }

    constraints.push(orderBy("modalPrice", "desc"))

    const querySnapshot = await getDocs(query(q, ...constraints))
    const prices: MandiPrice[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      prices.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as MandiPrice)
    })

    return { prices, error: null }
  } catch (error: any) {
    return { prices: [], error: error.message }
  }
}

// Price Alerts Collection
export interface PriceAlert {
  id?: string
  userId: string
  crop: string
  condition: "above" | "below"
  targetPrice: number
  enabled: boolean
  triggered: boolean
  triggeredAt?: Date
  createdAt: Date
}

export const createPriceAlert = async (alert: Omit<PriceAlert, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "priceAlerts"), {
      ...alert,
      createdAt: Timestamp.fromDate(alert.createdAt),
      triggeredAt: alert.triggeredAt ? Timestamp.fromDate(alert.triggeredAt) : null,
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getUserAlerts = async (userId: string) => {
  try {
    const q = query(collection(db, "priceAlerts"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    const alerts: PriceAlert[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      alerts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        triggeredAt: data.triggeredAt?.toDate(),
      } as PriceAlert)
    })

    return { alerts, error: null }
  } catch (error: any) {
    return { alerts: [], error: error.message }
  }
}

// ==================== STORAGE FUNCTIONS ====================

export const uploadReceipt = async (file: File, farmerId: string, reportId: string) => {
  try {
    const fileRef = ref(storage, `receipts/${farmerId}/${reportId}/${file.name}`)
    await uploadBytes(fileRef, file)
    const downloadUrl = await getDownloadURL(fileRef)
    return { url: downloadUrl, error: null }
  } catch (error: any) {
    return { url: null, error: error.message }
  }
}

// ==================== ANOMALY DETECTION ====================

export const detectPriceAnomaly = async (
  crop: string,
  district: string,
  reportedPrice: number,
): Promise<{ isAnomaly: boolean; reason?: string; deviation?: number }> => {
  try {
    // Get recent prices for the same crop in the district
    const { prices } = await getMandiPrices({ crop, district })

    if (prices.length === 0) {
      return { isAnomaly: false }
    }

    // Calculate average and standard deviation
    const avgPrice = prices.reduce((sum, p) => sum + p.modalPrice, 0) / prices.length
    const variance = prices.reduce((sum, p) => sum + Math.pow(p.modalPrice - avgPrice, 2), 0) / prices.length
    const stdDev = Math.sqrt(variance)

    // Check if reported price is more than 2 standard deviations away
    const deviation = Math.abs(reportedPrice - avgPrice)
    const deviationPercent = (deviation / avgPrice) * 100

    if (deviation > 2 * stdDev || deviationPercent > 30) {
      return {
        isAnomaly: true,
        reason:
          reportedPrice > avgPrice
            ? "Price significantly higher than market average"
            : "Price significantly lower than market average",
        deviation: deviationPercent,
      }
    }

    return { isAnomaly: false }
  } catch (error) {
    console.error("Anomaly detection error:", error)
    return { isAnomaly: false }
  }
}

// ==================== ANALYTICS HELPERS ====================

export const getMarketAnalytics = async (district?: string) => {
  try {
    const q = collection(db, "priceReports")
    const constraints: any[] = [where("status", "==", "approved")]

    if (district) {
      constraints.push(where("district", "==", district))
    }

    constraints.push(orderBy("createdAt", "desc"))
    constraints.push(limit(1000))

    const querySnapshot = await getDocs(query(q, ...constraints))
    const reports: PriceReport[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      reports.push({
        id: doc.id,
        ...data,
        transactionDate: data.transactionDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as PriceReport)
    })

    // Calculate analytics
    const totalTransactions = reports.length
    const totalVolume = reports.reduce((sum, r) => sum + r.quantity, 0)
    const totalValue = reports.reduce((sum, r) => sum + r.price * r.quantity, 0)

    // Crop distribution
    const cropCounts: Record<string, number> = {}
    reports.forEach((r) => {
      cropCounts[r.crop] = (cropCounts[r.crop] || 0) + 1
    })

    return {
      analytics: {
        totalTransactions,
        totalVolume,
        totalValue,
        cropDistribution: cropCounts,
      },
      error: null,
    }
  } catch (error: any) {
    return { analytics: null, error: error.message }
  }
}

export default app
