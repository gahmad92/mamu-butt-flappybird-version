# MAMU BUTT ADVENTURE: MOBILE LAUNCH ROADMAP

This document outlines the strategy for converting the Phaser + React web game into a fully functional Android application for the Google Play Store.

## 📱 Phase 1: Mobile Optimization (COMPLETED ✅)
- [x] **Responsive Scaling**: Set Phaser to `Scale.FIT` for all screen sizes.
- [x] **Fullscreen Meta Tags**: Added tags to hide browser bars.
- [x] **Touch Input**: Verified `pointerdown` for mobile tapping.

## 🛠 Phase 2: Android Wrapper (Capacitor Setup)
We will use **Capacitor** to "wrap" the web code into an Android project.

### Technical Steps:
1. **Dependency Installation**:
   - `npm install @capacitor/core @capacitor/cli @capacitor/android`
2. **Capacitor Initialization**:
   - Initialize with App ID: `com.mamubutt.adventure`
3. **Build & Sync**:
   - `npm run build` (Generate the web production files).
   - `npx cap add android` (Create the Android Studio project).
4. **Hardware Gestures**:
   - Map Android's "Back" button to the Game Pause/Main Menu.
   - Optimize touch latency for "instant" jumping.

## 🎨 Phase 3: Play Store Assets & Branding
Google requires specific images to list the game on the store.

- [ ] **App Icon**: 512x512 PNG (Mamu's face 🧔).
- [ ] **Splash Screen**: 2732x2732 PNG (Ghibli scenery with Mamu).
- [ ] **Feature Graphic**: 1024x500 PNG (Promotional banner).
- [ ] **Screenshots**: At least 4 screenshots of different biomes.

## 🚀 Phase 4: Final APK & Deployment
1. **Keystore Generation**: Create a secure digital signature for the app.
2. **Bundle Generation**: Generate a `.aab` (Android App Bundle) file in Android Studio.
3. **Play Console Upload**: Upload the bundle to the Google Play Console for review.

---

## 🧔 Mobile Gestures Implementation
We will use Phaser's built-in input system to detect specific Android-friendly gestures:
1. **The Flap (Tap)**: Handled by `pointerdown`.
2. **The Dive (Swipe Down)**: If a vertical swipe is detected, we will temporarily increase gravity or set `velocityY` to a high positive value.
3. **The Hover (Long Press)**: If the screen is held for more than 500ms, we will reduce gravity by 50% to let Mamu glide.

## 🛠 Next Steps
1. **Initialize Capacitor**: Run `npx cap init`.
2. **Web Build**: Run `npm run build`.
3. **Add Android Platform**: Run `npx cap add android`.
