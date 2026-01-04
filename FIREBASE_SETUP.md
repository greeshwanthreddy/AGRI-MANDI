# Firebase Setup Guide for AgriMandi

This guide explains how to set up Firebase for the AgriMandi platform.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `agrimandi` (or your preferred name)
4. Enable Google Analytics (recommended)
5. Click "Create project"

## 2. Enable Required Services

### Authentication
1. Go to Build > Authentication
2. Click "Get started"
3. Enable "Email/Password" sign-in method

### Firestore Database
1. Go to Build > Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location closest to your users (e.g., `asia-south1` for India)

### Storage
1. Go to Build > Storage
2. Click "Get started"
3. Choose security rules (start with test mode, update later)

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register app with nickname: `agrimandi-web`
5. Copy the configuration object

## 4. Add Environment Variables

Create or update your `.env.local` file with:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## 5. Firestore Security Rules

Copy these rules to Firestore > Rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Price Reports
    match /priceReports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.farmerId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Mandi Prices (official)
    match /mandiPrices/{priceId} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'mandi_owner'];
    }
    
    // Price Alerts
    match /priceAlerts/{alertId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
\`\`\`

## 6. Storage Security Rules

Copy these rules to Storage > Rules:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{farmerId}/{reportId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == farmerId;
    }
  }
}
\`\`\`

## 7. Create Firestore Indexes

Go to Firestore > Indexes and create:

1. **priceReports** collection:
   - farmerId (Ascending), createdAt (Descending)
   - status (Ascending), createdAt (Descending)
   - district (Ascending), createdAt (Descending)

2. **mandiPrices** collection:
   - crop (Ascending), district (Ascending), modalPrice (Descending)

3. **priceAlerts** collection:
   - userId (Ascending), createdAt (Descending)

## 8. Optional: Set Up Cloud Functions

For advanced features like anomaly detection and notifications, set up Cloud Functions:

\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init functions
\`\`\`

Example function for price anomaly detection:

\`\`\`javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.detectPriceAnomaly = functions.firestore
  .document('priceReports/{reportId}')
  .onCreate(async (snap, context) => {
    const report = snap.data();
    const { crop, district, price } = report;
    
    // Get average price for crop in district
    const pricesSnap = await admin.firestore()
      .collection('mandiPrices')
      .where('crop', '==', crop)
      .where('district', '==', district)
      .get();
    
    if (pricesSnap.empty) return;
    
    let totalPrice = 0;
    pricesSnap.forEach(doc => {
      totalPrice += doc.data().modalPrice;
    });
    const avgPrice = totalPrice / pricesSnap.size;
    
    // Check for anomaly (>30% deviation)
    const deviation = Math.abs(price - avgPrice) / avgPrice * 100;
    
    if (deviation > 30) {
      await snap.ref.update({
        anomalyFlag: true,
        anomalyReason: `Price deviates ${deviation.toFixed(1)}% from average`,
      });
    }
  });
\`\`\`

## 9. BigQuery Integration (Optional)

For advanced analytics:

1. Go to Firebase Console > Project Settings > Integrations
2. Link to BigQuery
3. Enable Firestore export to BigQuery

This allows you to run SQL queries on your data for market intelligence reports.

## Usage in Code

After setup, the Firebase integration is available through:

- `lib/firebase.ts` - Core Firebase functions
- `lib/firebase-hooks.ts` - React hooks for Firebase data

Example usage:

\`\`\`typescript
import { submitPriceReport, uploadReceipt } from '@/lib/firebase'

// Submit a price report
const { id, error } = await submitPriceReport({
  farmerId: user.uid,
  farmerName: user.name,
  crop: 'rice',
  price: 2450,
  // ... other fields
})

// Upload receipt
const { url } = await uploadReceipt(file, user.uid, reportId)
\`\`\`
\`\`\`
