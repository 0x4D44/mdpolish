/**
 * useConfig hook - Manages app configuration with persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { AppConfig } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

const DEFAULT_CONFIG: AppConfig = {
  timerDurationSeconds: 180, // 3 minutes
  soundEnabled: true,
  vibrationEnabled: true,
};

interface UseConfigReturn {
  config: AppConfig;
  loading: boolean;
  updateConfig: (updates: Partial<AppConfig>) => Promise<void>;
  resetConfig: () => Promise<void>;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const storedConfig = await storage.getItem<AppConfig>(STORAGE_KEYS.CONFIG);
        if (storedConfig) {
          setConfig({ ...DEFAULT_CONFIG, ...storedConfig });
        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Update config
  const updateConfig = useCallback(async (updates: Partial<AppConfig>) => {
    try {
      const newConfig = { ...config, ...updates };
      await storage.setItem(STORAGE_KEYS.CONFIG, newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('Error updating config:', error);
      throw error;
    }
  }, [config]);

  // Reset to defaults
  const resetConfig = useCallback(async () => {
    try {
      await storage.removeItem(STORAGE_KEYS.CONFIG);
      setConfig(DEFAULT_CONFIG);
    } catch (error) {
      console.error('Error resetting config:', error);
      throw error;
    }
  }, []);

  return {
    config,
    loading,
    updateConfig,
    resetConfig,
  };
}