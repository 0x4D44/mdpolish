// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo Haptics
jest.mock('expo-haptics', () => ({
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
}));

// Mock Expo AV
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({ sound: { unloadAsync: jest.fn(), playAsync: jest.fn(), replayAsync: jest.fn() } })),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock Expo Status Bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

// Mock Slider
jest.mock('@react-native-community/slider', () => 'Slider');

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Circle: 'Circle',
  G: 'G',
}));
