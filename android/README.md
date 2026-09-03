# NEO Live Room - Android APK Build Guide

This directory contains the complete, compilable native Android project for **NEO Live Room**.

## Project Architecture
- **Package Name**: `com.neolive.app`
- **Minimum SDK**: Android 7.0 (API 24)
- **Target / Compile SDK**: Android 15 (API 35)
- **Framework**: Jetpack Compose + Modern WebView Native Bridge + WebRTC Live Streaming
- **Monetization**: Google Play Billing 6.2+
- **Push Notifications**: Firebase Cloud Messaging (FCM)

---

## How to Build the Release APK

### Option 1: In Android Studio (Recommended)
1. Open **Android Studio** (Ladybug 2024.2+ or newer).
2. Click **File** -> **Open...** and select the `/android` folder.
3. Allow Gradle to synchronize dependencies.
4. From the top menu, select:
   **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
5. Upon completion, Android Studio will display a popup:
   *"APK(s) generated successfully for 1 module"*. Click **locate**.
6. The compiled Release APK is located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Option 2: Command Line (Terminal)
In your terminal, navigate to the `android` directory and run:

```bash
cd android
./gradlew assembleRelease
```
*(On Windows: `gradlew.bat assembleRelease`)*

Once compilation finishes, find your APK at:
```bash
android/app/build/outputs/apk/release/app-release.apk
```

To build a debug APK for immediate device testing:
```bash
./gradlew assembleDebug
# Generated at: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Signing for Google Play Store Production
To sign with your private upload keystore, place your `.jks` file in `android/app/` or supply properties via `gradle.properties`:
```properties
RELEASE_STORE_FILE=my-release-key.jks
RELEASE_STORE_PASSWORD=your_password
RELEASE_KEY_ALIAS=your_alias
RELEASE_KEY_PASSWORD=your_key_password
```
If no custom keystore is provided, the Gradle configuration safely defaults to debug keystore signing so `./gradlew assembleRelease` compiles successfully without failing.
