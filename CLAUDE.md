# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo application for a "Polish Timer" - a cross-platform timer application designed to help cadets track their shoe polishing sessions. The app provides interval-based timing with session tracking to encourage thorough and consistent polishing routines.

## Project Structure

```
mdpolish/
├── polish-timer/          # Main React Native Expo application
│   ├── App.tsx            # Root component
│   ├── index.ts           # Entry point registering the root component
│   ├── src/               # Source code directory (currently empty)
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context for state management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── screens/       # Main app screens
│   │   ├── theme/         # Design tokens and styling
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── tests/             # Test directory (currently empty)
│   ├── app.json           # Expo configuration
│   ├── package.json       # Node dependencies
│   └── tsconfig.json      # TypeScript configuration
└── wrk_docs/              # Working documents
    └── 2025.11.06 - HLD - Cadet Shoe Polish Timer.md  # High-level design document
```

## Development Commands

### Install Dependencies
```bash
cd polish-timer
npm install
```

### Run Development Server
```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Build Commands
```bash
# Build for Android (using EAS Build)
eas build --platform android

# Build for Web
expo build:web
```

## Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript 5.9
- **UI Library**: React Native 0.81.5
- **Web Support**: React Native Web 0.21.2
- **State Management**: React Context + Hooks (to be implemented)
- **Testing**: Jest + React Native Testing Library (configured but no tests yet)

## Architecture Notes

The application follows the architecture outlined in the HLD document:

1. **Timer Core Functionality**:
   - Configurable countdown timer (default 3 minutes)
   - Iteration tracking for multiple polishing rounds
   - Total time accumulation across iterations

2. **State Management**:
   - Session state (timer, iterations, total time)
   - Configuration (timer duration, sound/vibration settings)
   - Persistence using AsyncStorage/LocalStorage

3. **Component Structure**:
   - Timer display component
   - Control buttons (Start/Pause/Reset/Next Iteration)
   - Stats display (iterations, total time)
   - Settings modal for configuration

## TypeScript Configuration

The project uses strict TypeScript checking:
- Extends `expo/tsconfig.base`
- `strict: true` enabled

## Current Implementation Status

The project is in initial setup phase:
- Basic Expo project structure created
- Dependencies installed
- Empty placeholder directories for organized development
- No functional implementation yet

## Development Guidelines

1. **Component Development**: Create components in `src/components/` following React Native best practices
2. **Type Safety**: Define all interfaces and types in `src/types/`
3. **Custom Hooks**: Place timer logic and storage hooks in `src/hooks/`
4. **Styling**: Use React Native StyleSheet with design tokens from `src/theme/`
5. **Testing**: Write tests in `tests/` directory, aim for >80% coverage

## Key Implementation Priorities (from HLD)

### Phase 1 (MVP):
- Core timer with countdown logic
- Start/Pause/Reset controls
- Iteration tracking
- Total time accumulation
- Basic UI with clear visual hierarchy

### Phase 2:
- Configuration settings (timer duration)
- State persistence with AsyncStorage
- Session recovery on app launch

### Phase 3:
- Polish visual design
- Sound/vibration notifications
- Android background timer support
- Web deployment setup

## Important Design Decisions

1. **YAGNI Principle**: Avoid implementing features not explicitly requested:
   - No user accounts or cloud sync
   - No social features
   - No complex analytics
   - No iOS-specific features initially

2. **Platform Priority**: Focus on Android and Web platforms

3. **Storage**: All data stored locally on device

4. **UI/UX**:
   - Large touch targets (48x48pt minimum)
   - High contrast colors
   - Monospace font for timer display
   - Navy blue and gold color scheme