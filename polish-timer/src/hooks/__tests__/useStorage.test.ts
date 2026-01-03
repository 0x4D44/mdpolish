import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useStorage } from '../useStorage';
import { storage } from '../../utils/storage';

// Mock storage
jest.mock('../../utils/storage', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('useStorage', () => {
  const TEST_KEY = 'test_key';
  const TEST_VALUE = { foo: 'bar' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load data on mount', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(TEST_VALUE);

    const { result } = renderHook(() => useStorage(TEST_KEY));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(TEST_VALUE);
    expect(storage.getItem).toHaveBeenCalledWith(TEST_KEY);
  });

  it('should use initial value if storage is empty', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useStorage(TEST_KEY, TEST_VALUE));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(TEST_VALUE);
  });

  it('should save data', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);
    (storage.setItem as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useStorage(TEST_KEY));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.save(TEST_VALUE);
    });

    expect(result.current.data).toEqual(TEST_VALUE);
    expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, TEST_VALUE);
  });

  it('should remove data', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(TEST_VALUE);
    (storage.removeItem as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useStorage(TEST_KEY));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.remove();
    });

    expect(result.current.data).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith(TEST_KEY);
  });

  it('should handle load error', async () => {
    const error = new Error('Load failed');
    (storage.getItem as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useStorage(TEST_KEY));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    consoleSpy.mockRestore();
  });

  it('should handle save error', async () => {
    const saveError = new Error('Save failed');
    (storage.getItem as jest.Mock).mockResolvedValue(null);
    (storage.setItem as jest.Mock).mockRejectedValue(saveError); 

    const { result } = renderHook(() => useStorage(TEST_KEY));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.save(TEST_VALUE)).rejects.toThrow('Failed to save data');
    
    // The error stored in state is an Error object with the message
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to save data');
  });

  it('should handle save returning false', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);
    (storage.setItem as jest.Mock).mockResolvedValue(false); // Simulate failure return

    const { result } = renderHook(() => useStorage(TEST_KEY));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.save(TEST_VALUE)).rejects.toThrow('Failed to save data');
    expect(result.current.error?.message).toBe('Failed to save data');
  });

  it('should handle remove error', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(TEST_VALUE);
    (storage.removeItem as jest.Mock).mockResolvedValue(false); // Simulate failure

    const { result } = renderHook(() => useStorage(TEST_KEY));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.remove()).rejects.toThrow('Failed to remove data');
    
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to remove data');
  });
});