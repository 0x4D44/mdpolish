import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useConfig } from '../useConfig';
import { storage, STORAGE_KEYS } from '../../utils/storage';

jest.mock('../../utils/storage', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  STORAGE_KEYS: {
    CONFIG: 'test_config_key',
  },
}));

describe('useConfig', () => {
  const DEFAULT_CONFIG = {
    timerDurationSeconds: 180,
    soundEnabled: true,
    vibrationEnabled: true,
  };

  const MOCK_CONFIG = {
    timerDurationSeconds: 300,
    soundEnabled: false,
    vibrationEnabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load config on mount', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(MOCK_CONFIG);

    const { result } = renderHook(() => useConfig());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.config).toEqual(MOCK_CONFIG);
  });

  it('should use default config if storage is empty', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.config).toEqual(DEFAULT_CONFIG);
  });

  it('should update config', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateConfig({ soundEnabled: false });
    });

    expect(result.current.config.soundEnabled).toBe(false);
    expect(result.current.config.timerDurationSeconds).toBe(180); // Should keep other values
    
    expect(storage.setItem).toHaveBeenCalledWith(
      'test_config_key',
      expect.objectContaining({ soundEnabled: false, timerDurationSeconds: 180 })
    );
  });

  it('should reset config', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(MOCK_CONFIG);
    const { result } = renderHook(() => useConfig());

    await waitFor(() => expect(result.current.config).toEqual(MOCK_CONFIG));

    await act(async () => {
      await result.current.resetConfig();
    });

    expect(result.current.config).toEqual(DEFAULT_CONFIG);
    expect(storage.removeItem).toHaveBeenCalledWith('test_config_key');
  });

  it('should handle load error', async () => {
    const error = new Error('Load failed');
    (storage.getItem as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(consoleSpy).toHaveBeenCalledWith('Error loading config:', error);
    consoleSpy.mockRestore();
  });

  it('should handle update error', async () => {
    const error = new Error('Update failed');
    (storage.setItem as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useConfig());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.updateConfig({ soundEnabled: false })).rejects.toThrow(error);
    expect(consoleSpy).toHaveBeenCalledWith('Error updating config:', error);
    consoleSpy.mockRestore();
  });

  it('should handle reset error', async () => {
    const error = new Error('Reset failed');
    (storage.removeItem as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useConfig());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.resetConfig()).rejects.toThrow(error);
    expect(consoleSpy).toHaveBeenCalledWith('Error resetting config:', error);
    consoleSpy.mockRestore();
  });
});
