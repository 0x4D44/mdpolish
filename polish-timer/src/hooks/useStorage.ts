/**
 * useStorage hook - React hook for persistent storage
 */

import { useState, useEffect, useCallback } from 'react';
import { UseStorageReturn } from '../types';
import { storage } from '../utils/storage';

export function useStorage<T>(key: string, initialValue?: T): UseStorageReturn<T> {
  const [data, setData] = useState<T | null>(initialValue || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedData = await storage.getItem<T>(key);
        if (storedData !== null) {
          setData(storedData);
        }
      } catch (err) {
        setError(err as Error);
        console.error(`Error loading ${key}:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  // Save data
  const save = useCallback(async (value: T) => {
    try {
      setError(null);
      const success = await storage.setItem(key, value);
      if (success) {
        setData(value);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [key]);

  // Remove data
  const remove = useCallback(async () => {
    try {
      setError(null);
      const success = await storage.removeItem(key);
      if (success) {
        setData(null);
      } else {
        throw new Error('Failed to remove data');
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [key]);

  return {
    data,
    loading,
    error,
    save,
    remove,
  };
}