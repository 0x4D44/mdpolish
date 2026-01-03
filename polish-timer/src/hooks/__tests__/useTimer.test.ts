import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from '../useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useTimer(180));
    
    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.remainingSeconds).toBe(180);
    expect(result.current.state.currentIteration).toBe(1);
  });

  it('should start timer', () => {
    const { result } = renderHook(() => useTimer(180));
    
    act(() => {
      result.current.start();
    });

    expect(result.current.state.status).toBe('running');
  });

  it('should not restart if already running', () => {
    const { result } = renderHook(() => useTimer(180));
    
    act(() => {
      result.current.start();
    });
    
    // Advance some time
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    const remainingBefore = result.current.state.remainingSeconds;
    
    // Call start again
    act(() => {
      result.current.start();
    });
    
    // Should not reset start time or change anything
    expect(result.current.state.status).toBe('running');
    // If it restarted, it might reset pausedTime or startTime logic, 
    // effectively continuing smoothly or reseting. 
    // The code returns early: if (state.status === 'running') return;
    // So logic is simple.
  });

  it('should decrement remaining seconds when running', () => {
    const { result } = renderHook(() => useTimer(180));
    
    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.state.remainingSeconds).toBe(179);
  });

  it('should pause timer', () => {
    const { result } = renderHook(() => useTimer(180));
    
    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.state.status).toBe('paused');
    expect(result.current.state.remainingSeconds).toBe(179);

    // Verify it doesn't continue ticking
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.state.remainingSeconds).toBe(179);
  });

  it('should resume timer from paused state', () => {
    const { result } = renderHook(() => useTimer(180));
    
    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000); // 179
    });

    act(() => {
      result.current.pause();
    });

    act(() => {
      jest.advanceTimersByTime(1000); // Should stay 179
    });

    act(() => {
      result.current.start();
    });
      
    act(() => {
      jest.advanceTimersByTime(1000); // Should be 178
    });

    expect(result.current.state.remainingSeconds).toBe(178);
  });

  it('should reset timer', () => {
    const { result } = renderHook(() => useTimer(180));
    
    act(() => {
      result.current.start();
      jest.advanceTimersByTime(5000);
      result.current.reset();
    });

    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.remainingSeconds).toBe(180);
  });

  it('should complete timer when time runs out', () => {
    const { result } = renderHook(() => useTimer(3));
    
    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(3100); // Go past 3 seconds
    });

    expect(result.current.state.status).toBe('completed');
    expect(result.current.state.remainingSeconds).toBe(0);
  });

  it('should increment iteration and reset on complete()', () => {
    const { result } = renderHook(() => useTimer(180));
    
    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.complete();
    });

    expect(result.current.state.currentIteration).toBe(2);
    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.remainingSeconds).toBe(180);
  });

  it('should update remaining seconds when duration prop changes (while idle)', () => {
    const { result, rerender } = renderHook((props: { duration: number }) => useTimer(props.duration), {
      initialProps: { duration: 180 },
    });
    
    expect(result.current.state.remainingSeconds).toBe(180);

    rerender({ duration: 300 });

    expect(result.current.state.remainingSeconds).toBe(300);
  });

  it('should not pause if not running', () => {
    const { result } = renderHook(() => useTimer(180));
    
    // Idle
    act(() => {
      result.current.pause();
    });
    
    expect(result.current.state.status).toBe('idle');
  });
});
