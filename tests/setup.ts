import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
}));

// Mock biometric authentication
jest.mock('expo-local-authentication', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  authenticate: jest.fn().mockResolvedValue(true),
}));

// Mock notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({}),
  getLastNotificationResponseAsync: jest.fn().mockResolvedValue(null),
}));

// Setup global test configuration
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
