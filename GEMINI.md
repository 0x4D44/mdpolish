# mdpolish - Cadet Shoe Polish Timer

## Project Overview

**mdpolish** is a cross-platform (Android/Web) application designed to help cadets track and time their shoe polishing sessions. Built with **React Native** and **Expo**, it features configurable interval timers, iteration tracking, and session persistence to encourage consistent polishing routines.

The project follows a "YAGNI" (You Aren't Gonna Need It) philosophy, focusing on a clean, distraction-free interface without unnecessary complexity like user accounts or cloud sync.

## Technical Architecture

### Tech Stack
*   **Framework:** React Native 0.81 (Expo SDK 54)
*   **Language:** TypeScript 5.9 (Strict mode enabled)
*   **Platform Support:** Android, Web (via React Native Web)
*   **State Management:** React Context + Custom Hooks (`useTimer`, `useSession`)
*   **Persistence:** `@react-native-async-storage/async-storage`
*   **Audio/Haptics:** `expo-av`, `expo-haptics`
*   **Testing:** Jest, React Native Testing Library (Configured)

### Project Structure
The repository is organized as follows:

*   `polish-timer/`: The main React Native application directory.
    *   `App.tsx`: Application root component.
    *   `app.json`: Expo configuration.
    *   `src/`: Source code.
        *   `components/`: Reusable UI components (Timer, Controls, Stats).
        *   `hooks/`: Business logic hooks (`useTimer`, `useStorage`).
        *   `types/`: TypeScript definitions (`index.ts`).
        *   `utils/`: Helper functions.
*   `wrk_docs/`: Documentation and design specs (HLD, plans).
*   `wrk_journals/`: Development logs.

### Key Data Models
Defined in `polish-timer/src/types/index.ts`:
*   **TimerState:** `status` (idle/running/paused/completed), `remainingSeconds`, `currentIteration`.
*   **Session:** `iterations`, `totalTimeSeconds`, `timerDurationSeconds`.
*   **AppConfig:** `timerDurationSeconds`, `soundEnabled`, `vibrationEnabled`.

## Development Workflow

All commands should be run from the `polish-timer` directory.

### Installation
```bash
cd polish-timer
npm install
```

### Running the App
```bash
# Start the Expo development server
npm start

# Run on Android Emulator/Device
npm run android

# Run in Web Browser
npm run web
```

### Building for Production
```bash
# Build for Android (APK/AAB) via EAS
eas build --platform android

# Build for Web
npm run build:web
```

## Conventions & Standards

*   **TypeScript:** Strict type checking is enforced. All interfaces should be defined in `src/types/`.
*   **Components:** Functional components using Hooks. UI logic should be separated from business logic where possible.
*   **Styling:** Use `StyleSheet.create` for styles. Follow the design tokens (Navy Blue #1a237e, Gold #ffd700).
*   **Persistence:** All session data and settings must persist across app restarts using `AsyncStorage`.
*   **Testing:** Aim for high coverage on core logic hooks (`useTimer`, `useSession`).

## Current Status
The application is feature-complete for the MVP phase, including:
*   Configurable countdown timer.
*   Session iteration tracking.
*   Sound and vibration notifications.
*   Local persistence of settings and active sessions.
*   Production-ready Android build configuration.
