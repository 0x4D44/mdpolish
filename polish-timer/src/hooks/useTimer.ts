/**
 * useTimer hook - Manages timer countdown logic with accuracy
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerStatus, UseTimerReturn } from '../types';

export function useTimer(durationSeconds: number): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    status: 'idle',
    remainingSeconds: durationSeconds,
    currentIteration: 1,
  });

  // Use refs to maintain accurate timing
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update remaining seconds when duration changes
  useEffect(() => {
    if (state.status === 'idle') {
      setState(prev => ({
        ...prev,
        remainingSeconds: durationSeconds,
      }));
    }
  }, [durationSeconds, state.status]);

  // Start the timer
  const start = useCallback(() => {
    if (state.status === 'running') return;

    const now = Date.now();

    if (state.status === 'paused' && startTimeRef.current) {
      // Resuming from pause - add the paused duration to start time
      const pauseDuration = now - pausedTimeRef.current;
      startTimeRef.current = startTimeRef.current + pauseDuration;
    } else {
      // Starting fresh
      startTimeRef.current = now;
      pausedTimeRef.current = 0;
    }

    setState(prev => ({
      ...prev,
      status: 'running',
    }));

    // Use interval to update display, but calculate time based on Date.now()
    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, durationSeconds - elapsed);

      setState(prev => ({
        ...prev,
        remainingSeconds: remaining,
      }));

      // Timer completed
      if (remaining === 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setState(prev => ({
          ...prev,
          status: 'completed',
          remainingSeconds: 0,
        }));
      }
    }, 100); // Update every 100ms for smooth display
  }, [state.status, durationSeconds]);

  // Pause the timer
  const pause = useCallback(() => {
    if (state.status !== 'running') return;

    pausedTimeRef.current = Date.now();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setState(prev => ({
      ...prev,
      status: 'paused',
    }));
  }, [state.status]);

  // Reset the timer
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    setState(prev => ({
      ...prev,
      status: 'idle',
      remainingSeconds: durationSeconds,
    }));
  }, [durationSeconds]);

  // Complete the current iteration and prepare for next
  const complete = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    setState(prev => ({
      ...prev,
      status: 'idle',
      remainingSeconds: durationSeconds,
      currentIteration: prev.currentIteration + 1,
    }));
  }, [durationSeconds]);

  return {
    state,
    start,
    pause,
    reset,
    complete,
  };
}