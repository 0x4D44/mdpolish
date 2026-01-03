import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSession } from '../useSession';
import { storage, STORAGE_KEYS } from '../../utils/storage';

jest.mock('../../utils/storage', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
  STORAGE_KEYS: {
    CURRENT_SESSION: 'test_session_key',
  },
}));

describe('useSession', () => {
  const MOCK_SESSION = {
    id: 'test_id',
    startTime: 1000,
    iterations: 5,
    totalTimeSeconds: 300,
    timerDurationSeconds: 180,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load existing session on mount', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(MOCK_SESSION);

    const { result } = renderHook(() => useSession());

    await waitFor(() => {
      expect(result.current.iterations).toBe(5);
    });

    expect(result.current.session).toEqual(MOCK_SESSION);
    expect(result.current.totalTimeSeconds).toBe(300);
  });

  it('should create new session if none exists', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(123456);

    const { result } = renderHook(() => useSession());

    await waitFor(() => {
      expect(result.current.session).not.toBeNull();
    });

    expect(result.current.iterations).toBe(0);
    expect(result.current.totalTimeSeconds).toBe(0);
    expect(result.current.session).toEqual(expect.objectContaining({
      iterations: 0,
      totalTimeSeconds: 0,
      startTime: 123456,
    }));
    
    expect(storage.setItem).toHaveBeenCalled();
    nowSpy.mockRestore();
  });

  it('should increment iterations', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(MOCK_SESSION);
    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.session).not.toBeNull());

    await act(async () => {
      result.current.incrementIteration();
    });

    expect(result.current.iterations).toBe(6);
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.CURRENT_SESSION,
      expect.objectContaining({ iterations: 6 })
    );
  });

  it('should add time', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(MOCK_SESSION);
    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.session).not.toBeNull());

    await act(async () => {
      result.current.addTime(10);
    });

    expect(result.current.totalTimeSeconds).toBe(310);
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.CURRENT_SESSION,
      expect.objectContaining({ totalTimeSeconds: 310 })
    );
  });

  it('should reset session', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(MOCK_SESSION);
    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.session).not.toBeNull());

    await act(async () => {
      await result.current.resetSession();
    });

    expect(result.current.iterations).toBe(0);
    expect(result.current.totalTimeSeconds).toBe(0);
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.CURRENT_SESSION,
      expect.objectContaining({ iterations: 0, totalTimeSeconds: 0 })
    );
  });

  it('should handle load error', async () => {
    const error = new Error('Load failed');
    (storage.getItem as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useSession());
    
    // Wait for effect to run
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error loading session:', error));
    consoleSpy.mockRestore();
  });

  it('should handle save error', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(MOCK_SESSION);
    const error = new Error('Save failed');
    (storage.setItem as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.session).not.toBeNull());

    await act(async () => {
      result.current.incrementIteration();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error saving session:', error);
    consoleSpy.mockRestore();
  });

  it('should not update session if not loaded', async () => {
    // Simulate never loading
    (storage.getItem as jest.Mock).mockImplementation(() => new Promise(() => {})); 

    const { result } = renderHook(() => useSession());
    
    // Attempt actions immediately
    await act(async () => {
      result.current.incrementIteration();
      result.current.addTime(10);
    });

    // Since currentSession is null (initial state), these should essentially be no-ops
    // or at least not crash.
    // We can't verify internal state easily if it didn't change, 
    // but code coverage will verify the 'if (currentSession)' branch was checked.
    expect(result.current.session).toBeNull();
  });
});
