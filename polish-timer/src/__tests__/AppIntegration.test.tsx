import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import App from '../../App';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { notificationManager } from '../utils/notifications';

// Mock storage
jest.mock('../utils/storage', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  STORAGE_KEYS: {
    CONFIG: 'config_key',
    CURRENT_SESSION: 'session_key',
  },
}));

// Mock notifications (keep methods as jest.fns we can spy on)
jest.mock('../utils/notifications', () => ({
  notificationManager: {
    initialize: jest.fn(),
    cleanup: jest.fn(),
    playCompletionNotification: jest.fn(),
  },
}));

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render loading state then main app', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null); // Defaults

    const { getByText, queryByText } = render(<App />);

    expect(getByText('Loading...')).toBeTruthy();

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeNull();
    });

    expect(getByText('Polish Timer')).toBeTruthy();
    expect(getByText('Iteration 1')).toBeTruthy();
  });

  it('should start timer and complete iteration', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<App />);
    await waitFor(() => expect(getByText('Polish Timer')).toBeTruthy());

    // Start
    fireEvent.press(getByText('▶️ Start'));
    
    // Fast forward to completion (180s default)
    act(() => {
      jest.advanceTimersByTime(180000 + 1000);
    });

    expect(getByText('Complete! ✨')).toBeTruthy();
    expect(notificationManager.playCompletionNotification).toHaveBeenCalled();

    // Next Iteration
    fireEvent.press(getByText('✨ Next Iteration'));
    
    // Should auto-start next iteration
    act(() => {
        jest.advanceTimersByTime(200);
    });
    
    expect(getByText('Iteration 2')).toBeTruthy();
  });

  it('should open settings and update duration', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<App />);
    await waitFor(() => expect(getByText('Polish Timer')).toBeTruthy());

    // Open Settings (find by text '⚙️')
    fireEvent.press(getByText('⚙️'));

    expect(getByText('Settings')).toBeTruthy();

    // Update settings (Save button)
    // Note: Changing slider is hard in integration without internal logic, 
    // but we can press Save which should trigger updateConfig with current state (defaults)
    fireEvent.press(getByText('Save'));

    await waitFor(() => expect(storage.setItem).toHaveBeenCalled());
  });

  it('should reset session when New Session is pressed', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<App />);
    await waitFor(() => expect(getByText('Polish Timer')).toBeTruthy());

    // Open Settings and press New Session
    fireEvent.press(getByText('⚙️'));
    fireEvent.press(getByText('New Session'));

    // Should call resetSession
    // storage.setItem should be called with defaults (iterations: 0)
    await waitFor(() => {
        expect(storage.setItem).toHaveBeenCalledWith(
            STORAGE_KEYS.CURRENT_SESSION, 
            expect.objectContaining({ iterations: 0 })
        );
    });
  });
});
