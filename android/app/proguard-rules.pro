# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /Users/android-sdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.

# Keep data models for Firestore & JSON serialization
-keep class com.neolive.app.data.model.** { *; }
-keep class com.neolive.app.data.service.** { *; }

# Keep JavaScript Interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# LiveKit WebRTC rules
-keep class io.livekit.android.** { *; }
-keep class org.webrtc.** { *; }
-dontwarn org.webrtc.**

# Google Play Billing
-keep class com.android.billingclient.api.** { *; }

# Compose rules
-keep class androidx.compose.** { *; }
