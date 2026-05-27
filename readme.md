# 📚 Custom Book Tracker App

A sleek, dark-themed React Native mobile application built with **Expo (SDK 54)** and **React 19** that integrates with the Open Library API. The app features a high-performance horizontal swipe navigation canvas, global context state synchronization, persistent caching, and custom modal confirmation systems.

---

## 🚀 Features

* **Real-time Open Library Search:** Fetch books, summaries, page counts, and covers dynamically from the Open Library API.
* **Gestural Horizontal Navigation:** A custom-engineered, top-mounted navigation bar paired with a `ScrollView` canvas allowing seamless swipe transitions between screens.
* **Persistent Global State:** Managed via React Context and backed by native device storage (`AsyncStorage`).
* **Overlay Navigation Pattern:** Full-screen absolute layer positioning (`zIndex: 999`) for book details to preserve background scroll layouts and search query states.
* **Cross-Tab State Migration:** Safely move books from *Search* $\rightarrow$ *To Read* $\rightarrow$ *Finished* with integrated prevention of event bubbling (`e.stopPropagation()`).
* **Celebration Modals:** Custom dark-themed alerts highlighting user progress when lists are updated.

---

## 🛠️ App Architecture & File Structure

```text
├── App.js                         # Central Controller, Top Tabs & Gesture Navigation
├── package.json                   # Project Configurations & Expo SDK Dependency Tree
├── .npmrc                         # Local package resolution rules
└── src/
    ├── context/
    │   └── BookContext.js         # Global State Engine & AsyncStorage syncing
    └── screens/
        ├── SearchScreen.js        # API querying & result listing
        ├── ToReadScreen.js        # "Want to Read" queue with complete actions
        ├── DoneScreen.js          # Finished repository with history logging
        └── BookDetailScreen.js    # Comprehensive profile analytics & dynamic metrics

```

---

## 💻 Tech Stack & Packages

* **Framework:** Expo SDK 54 (`~54.0.34`)
* **Core Engine:** React 19.1.0 & React Native 0.81.0
* **Data Layer:** React Context API & Native `AsyncStorage` (`~3.1.0`)
* **Navigation Hooks:** `@react-navigation/native` (v7) & `react-native-screens` (`~4.25.2`)

---

## ⚙️ Local Setup Instructions

Follow these instructions to run the codebase locally on your machine:

### 1. Clone & Navigate to the Repository

```bash
cd booktrackerapp

```

### 2. Configure Local Package Behavior

Ensure that a `.npmrc` file exists in your project root folder with the following configuration to bypass strict version checks between React Native 0.81.0 and React Native Screens 4.25.2:

```text
legacy-peer-deps=true

```

### 3. Clear Cache and Clean Install Dependencies

```bash
# Delete temporary lock files if they exist
# Windows:
rmdir /s /q node_modules 2>nul & del package-lock.json 2>nul
# Mac / Linux:
rm -rf node_modules package-lock.json

# Re-install cleanly
npm install

```

### 4. Boot the Expo Development Server

```bash
npx expo start --clear

```

*Scan the generated QR code on your terminal screen using the **Expo Go** app on iOS or Android to preview.*

---

## 📦 Packaging and Compiling to Android APK

This project is fully configured to compile directly into a shareable Android Package (`.apk`) using **Expo Application Services (EAS)** in the cloud.

### 1. Install EAS CLI Globally

```bash
npm install -g eas-cli

```

### 2. Authenticate with Expo

```bash
eas login

```

### 3. Configure the EAS Profile (`eas.json`)

Verify that your root `eas.json` file contains the target configuration mapping inside its `preview` profile to build an installable APK instead of an AAB:

```json
{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "NPM_CONFIG_LEGACY_PEER_DEPS": "true"
      }
    },
    "production": {}
  }
}

```

### 4. Execute the Cloud Build Command

Trigger the cloud production compiler by executing:

```bash
eas build --platform android --profile preview

```

* Select **Yes** if asked to generate a new Android Keystore.
* Once the cloud builder completes (approx. 5-10 minutes), scan the resulting terminal **QR Code** with your smartphone to download and install your standalone APK!
