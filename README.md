# Cadet Shoe Polish Timer

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Test Coverage](https://img.shields.io/badge/coverage-98%25-brightgreen)]()
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

A dedicated cross-platform application (Android & Web) designed to help cadets and professionals maintain consistent, high-quality shoe polishing routines.

## 🎯 Overview

The **Cadet Shoe Polish Timer** (`mdpolish`) is a focused utility that brings structure to the "spit and polish" process. Instead of guessing or using a generic phone timer, this app provides interval-based timing, automatic iteration tracking, and session persistence. It helps users apply consistent layers of polish by tracking both the duration of each layer and the total effort expended.

## ✨ Key Features

- **⏱️ Precision Interval Timer:** Configurable countdown timer (default: 3 minutes) tailored for standard polishing rounds.
- **🔄 Iteration Tracking:** Automatically counts completed layers ("iterations") to ensure even application.
- **📊 Session Statistics:** Real-time tracking of total active polishing time and total layers applied.
- **💾 Smart Persistence:** Never lose progress. Sessions are saved locally and can be resumed even if the app is closed or the device reboots.
- **🎛️ Distraction-Free UI:** High-contrast "Navy & Gold" military aesthetic with large touch targets, designed for use with dirty hands.
- **🔔 Audio & Haptic Feedback:** Distinct notifications when a layer is complete, allowing you to focus on the shoe, not the screen.
- **⚙️ Configurable:** Customize timer duration, sound, and vibration settings.

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev/) (v0.81) with [Expo](https://expo.dev/) (SDK 54)
- **Language:** TypeScript 5.9 (Strict Mode)
- **State Management:** React Context + Custom Hooks
- **Persistence:** `@react-native-async-storage/async-storage`
- **Testing:** Jest, React Native Testing Library
- **Platform Support:** Android (Native), Web (React Native Web)

## 🚀 Getting Started

The project is hosted in the `polish-timer` directory.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- *Optional:* [Android Studio](https://developer.android.com/studio) (for local Android simulation)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/mdpolish.git
    cd mdpolish
    ```

2.  Navigate to the project directory and install dependencies:
    ```bash
    cd polish-timer
    npm install
    ```

### Running the App

*   **Start the Development Server:**
    ```bash
    npm start
    ```
    This opens the Expo CLI. You can press `a` to run on Android (emulator or connected device) or `w` to run in the web browser.

*   **Run on Web directly:**
    ```bash
    npm run web
    ```

*   **Run on Android directly:**
    ```bash
    npm run android
    ```

## 🧪 Testing

This project maintains high code coverage (>98%) to ensure reliability.

### Run Unit & Integration Tests
```bash
cd polish-timer
npm test
```

### Check Code Coverage
```bash
npm run test:cov
```
This will generate a coverage report in the `coverage/` directory and display a summary in the terminal.

### Type Checking
```bash
npx tsc --noEmit
```

## 🏗️ Building for Production

### Android (APK/AAB)

This project is configured for **EAS Build**.

1.  Install the EAS CLI:
    ```bash
    npm install -g eas-cli
    ```

2.  Login to your Expo account:
    ```bash
    eas login
    ```

3.  Build the Android App Bundle (AAB) for Play Store:
    ```bash
    eas build --platform android
    ```

### Web

To generate a static bundle for deployment (e.g., GitHub Pages, Netlify):

```bash
npm run build:web
```
The output will be in the `dist/` directory.

## 📂 Project Structure

```text
mdpolish/
├── polish-timer/          # Main Application Code
│   ├── App.tsx            # Application Entry Point
│   ├── app.json           # Expo Configuration
│   ├── jest.config.js     # Testing Configuration
│   └── src/
│       ├── components/    # UI Components (Timer, Controls, Stats)
│       ├── hooks/         # Business Logic (useTimer, useSession, useConfig)
│       ├── types/         # TypeScript Definitions
│       └── utils/         # Helpers (Storage, Notifications)
├── wrk_docs/              # Architecture & Design Documents
└── wrk_journals/          # Development Logs
```

## 📐 Design Philosophy

This project adheres to a **YAGNI** (You Aren't Gonna Need It) approach:
*   **Local First:** No accounts, no cloud sync, no internet requirement. All data lives on your device.
*   **Purpose-Built:** No social features or complex analytics. Just the tools needed to get the job done.
*   **Reliability:** High test coverage ensures the timer works exactly when you need it.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).