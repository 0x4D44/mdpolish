/**
 * useSession hook - Manages session state with persistence
 */

import { useState, useCallback, useEffect } from 'react';
import { UseSessionReturn, Session } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

export function useSession(): UseSessionReturn {
  const [iterations, setIterations] = useState(0);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await storage.getItem<Session>(STORAGE_KEYS.CURRENT_SESSION);
        if (storedSession) {
          setCurrentSession(storedSession);
          setIterations(storedSession.iterations);
          setTotalTimeSeconds(storedSession.totalTimeSeconds);
        } else {
          // Create new session
          const newSession: Session = {
            id: Date.now().toString(),
            startTime: Date.now(),
            iterations: 0,
            totalTimeSeconds: 0,
            timerDurationSeconds: 180,
          };
          setCurrentSession(newSession);
          await storage.setItem(STORAGE_KEYS.CURRENT_SESSION, newSession);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };

    loadSession();
  }, []);

  // Save session whenever it changes
  const saveSession = useCallback(async (session: Session) => {
    try {
      await storage.setItem(STORAGE_KEYS.CURRENT_SESSION, session);
      setCurrentSession(session);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, []);

  const incrementIteration = useCallback(() => {
    const newIterations = iterations + 1;
    setIterations(newIterations);

    if (currentSession) {
      const updatedSession = { ...currentSession, iterations: newIterations };
      saveSession(updatedSession);
    }
  }, [iterations, currentSession, saveSession]);

  const addTime = useCallback((seconds: number) => {
    const newTotalTime = totalTimeSeconds + seconds;
    setTotalTimeSeconds(newTotalTime);

    if (currentSession) {
      const updatedSession = { ...currentSession, totalTimeSeconds: newTotalTime };
      saveSession(updatedSession);
    }
  }, [totalTimeSeconds, currentSession, saveSession]);

  const resetSession = useCallback(async () => {
    setIterations(0);
    setTotalTimeSeconds(0);

    // Create new session
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: Date.now(),
      iterations: 0,
      totalTimeSeconds: 0,
      timerDurationSeconds: 180,
    };

    await saveSession(newSession);
  }, [saveSession]);

  return {
    session: currentSession,
    iterations,
    totalTimeSeconds,
    incrementIteration,
    addTime,
    resetSession,
  };
}