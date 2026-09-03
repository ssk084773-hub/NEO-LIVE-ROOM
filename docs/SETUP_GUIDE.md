# NEO Live Room - Android Native & Backend Production Guide

## 1. Project Overview & Architecture
NEO Live Room is a high-performance Android live-streaming, social community, and creator economy platform built with **Kotlin**, **Jetpack Compose (Material 3)**, **Firebase**, **LiveKit / Agora WebRTC**, and **Google Play Billing**.

```
NEOLiveRoom/
├── android/
│   ├── app/
│   │   ├── build.gradle.kts                # Android dependencies & SDK configurations
│   │   └── src/main/
│   │       ├── AndroidManifest.xml         # Camera, Audio, Billing, Foreground permissions
│   │       └── java/com/neolive/app/
│   │           ├── MainActivity.kt         # Jetpack Compose UI Entry & Navigation
│   │           ├── data/
│   │           │   ├── model/Models.kt     # Kotlin Data Models (User, Room, Gift, Wallet)
│   │           │   ├── service/
│   │           │   │   ├── StreamingService.kt # LiveKit / Agora WebRTC Provider Interface
│   │           │   │   └── BillingService.kt   # Google Play In-App Billing Client 6.x
│   │           │   └── repository/NeoRepository.kt
│   │           └── ui/screens/             # Jetpack Compose Screens
│   │               ├── HomeScreen.kt
│   │               ├── LiveRoomScreen.kt
│   │               ├── WalletScreen.kt
│   │               ├── ProfileScreen.kt
│   │               └── AdminScreen.kt
│   ├── build.gradle.kts
│   └── settings.gradle.kts
├── backend/
│   ├── firestore.rules                     # Production Firestore Security Rules
│   └── functions/index.js                  # Cloud Functions for ledger, billing & token gen
├── docs/SETUP_GUIDE.md
└── src/                                    # Interactive Web Application & Android Simulator
```

---

## 2. Database Schema (Cloud Firestore)

| Collection | Key Fields | Access Control |
| :--- | :--- | :--- |
| `users/{userId}` | `username`, `displayName`, `avatar`, `coins`, `earningsDiamonds`, `role`, `isVerified`, `isBanned` | Read: Authenticated. Balance write: Cloud Functions only |
| `rooms/{roomId}` | `hostId`, `title`, `category`, `type` (video/audio), `viewerCount`, `likeCount`, `status`, `streamChannelId` | Read: Public. Write: Host / Admin |
| `rooms/{id}/messages` | `senderId`, `senderName`, `text`, `giftId`, `type`, `timestamp` | Read: Public. Create: Authenticated participants |
| `transactions/{txId}` | `userId`, `amount`, `currency`, `type`, `status`, `referenceId`, `paymentMethod` | Read: Owner/Admin. Write: Server-only (Immutable) |
| `withdrawals/{id}` | `userId`, `amountUsd`, `diamondsDeducted`, `method`, `accountDetails`, `status` | Create: Owner. Status Update: Admin only |
| `creator_applications` | `userId`, `fullName`, `governmentIdType`, `idNumber`, `socialLinks`, `status` | Create: Owner. Review: Admin only |
| `reports/{reportId}` | `reporterId`, `targetType`, `targetId`, `reason`, `details`, `status` | Create: Authenticated. Review: Admin only |

---

## 3. Required Environment Variables

Add these to your Firebase Cloud Functions environment or `.env` file:

```env
# Firebase
FIREBASE_PROJECT_ID="neo-live-room"

# LiveKit WebRTC Streaming Provider
LIVEKIT_URL="wss://live.neolive.app"
LIVEKIT_API_KEY="APIxxxxxxxxx"
LIVEKIT_API_SECRET="sec_yyyyyyyyyy"

# Agora Alternative (if chosen)
AGORA_APP_ID="your_agora_app_id"
AGORA_APP_CERTIFICATE="your_agora_certificate"

# Google Play Billing Service Account
GOOGLE_APPLICATION_CREDENTIALS="service-account-key.json"
ANDROID_PACKAGE_NAME="com.neolive.app"
```

---

## 4. Connecting Firebase to the Android Project

1. Open [Firebase Console](https://console.firebase.google.com/) and create a project named `neo-live-room`.
2. Add an **Android App** with package name `com.neolive.app`.
3. Generate your SHA-1 fingerprint via terminal:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
4. Download `google-services.json` and paste it inside `/android/app/google-services.json`.
5. Deploy the Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
6. Deploy the Cloud Functions:
   ```bash
   cd backend/functions && npm install && firebase deploy --only functions
   ```

---

## 5. Connecting Live Streaming (LiveKit or Agora)

### Option A: LiveKit (Recommended for ultra-low latency & open-source cost control)
1. Sign up on [LiveKit Cloud](https://cloud.livekit.io/) or self-host LiveKit on a Kubernetes/Docker node.
2. In `android/app/build.gradle.kts`, ensure `io.livekit:livekit-android:2.1.2` is active.
3. Call `generateStreamToken` from Cloud Functions when host creates room or viewer joins.
4. Pass the returned JWT to `LiveKitStreamingService.kt`.

### Option B: Agora RTC
1. In `android/app/build.gradle.kts`, uncomment `implementation("io.agora.rtc:full-sdk:4.3.0")`.
2. Provide your `AGORA_APP_ID` in `StreamingConfig`.

---

## 6. Configuring Google Play Billing

1. Open **Google Play Console** -> **Monetization** -> **In-app products**.
2. Create the exact Product IDs matching `BillingService.kt`:
   - `com.neolive.coins_100` ($0.99)
   - `com.neolive.coins_550` ($4.99)
   - `com.neolive.coins_1200` ($9.99)
   - `com.neolive.coins_3200` ($24.99)
   - `com.neolive.coins_7000` ($49.99)
   - `com.neolive.coins_15000` ($99.99)
3. Set status to **Active**.
4. In Google Cloud Console, grant `Google Play Android Developer API` permissions to your backend service account so `verifyGooglePlayPurchase` Cloud Function can validate receipt tokens securely.

---

## 7. Android Studio Build Instructions (Debug APK)

1. Open Android Studio -> Select **Open an Existing Project** -> Navigate to `/android`.
2. Let Gradle sync dependencies.
3. Connect an Android phone or launch an Android Virtual Device (API 34+).
4. Run:
   ```bash
   ./gradlew assembleDebug
   ```
   The APK is generated at: `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 8. Release AAB (Android App Bundle) Build Instructions

1. Generate a production keystore:
   ```bash
   keytool -genkey -v -keystore neo-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias neo-key
   ```
2. In `android/app/build.gradle.kts`, reference your signing config.
3. Build the signed bundle:
   ```bash
   ./gradlew bundleRelease
   ```
4. Find the production bundle at: `android/app/build/outputs/bundle/release/app-release.aab`.

---

## 9. Google Play Publishing & Compliance Checklist

- [x] **App Content & Data Safety**: Disclose Camera & Microphone usage for live streaming; User ID and In-App Purchase history for billing.
- [x] **User-Generated Content (UGC) Policy**:
  - In-app reporting for rooms, users, and chat messages.
  - User blocking mechanism.
  - Clear Community Guidelines and Terms of Service links.
  - Admin/Moderator controls (mute, kick, ban).
- [x] **Financial & Earning Disclaimers**: Disclosed that virtual diamond rewards depend strictly on platform eligibility, creator rules, and verified identity. No guaranteed returns.
- [x] **Account Deletion**: Self-service account deletion screen in compliance with Google Play Policy 2024+.
- [x] **Target Audience & Families Policy**: Marked 18+ or Mature due to live audio/video streaming and user-generated chat interactions.
