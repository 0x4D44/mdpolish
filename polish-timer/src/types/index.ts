/**
 * Type definitions for the Polish Timer application
 */

/**
 * Represents the possible states of the timer
 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Represents the current state of the timer
 */
export interface TimerState {
  status: TimerStatus;
  remainingSeconds: number;
  currentIteration: number;
}

/**
 * Represents a polishing session
 */
export interface Session {
  id: string;                    // UUID
  startTime: number;             // Unix timestamp
  endTime?: number;              // Unix timestamp (if completed)
  iterations: number;            // Count of completed iterations
  totalTimeSeconds: number;      // Accumulated active time
  timerDurationSeconds: number;  // Duration setting used for this session
}

/**
 * Application configuration
 */
export interface AppConfig {
  timerDurationSeconds: number;  // Default: 180 (3 minutes)
  soundEnabled: boolean;         // Default: true
  vibrationEnabled: boolean;     // Default: true (Android only)
}

/**
 * Session context state
 */
export interface SessionContextState {
  currentSession: Session | null;
  config: AppConfig;
}

/**
 * Timer hook return type
 */
export interface UseTimerReturn {
  state: TimerState;
  start: () => void;
  pause: () => void;
  reset: () => void;
  complete: () => void;
}

/**
 * Session hook return type
 */
export interface UseSessionReturn {
  session: Session | null;
  iterations: number;
  totalTimeSeconds: number;
  incrementIteration: () => void;
  addTime: (seconds: number) => void;
  resetSession: () => void;
}

/**
 * Storage hook return type
 */
export interface UseStorageReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  save: (data: T) => Promise<void>;
  remove: () => Promise<void>;
}

/**
 * Session history for optional historical tracking
 */
export interface SessionHistory {
  sessions: Session[];
  totalIterations: number;
  totalTimeSeconds: number;
}