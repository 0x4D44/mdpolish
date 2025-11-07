/**
 * Storage utility - Cross-platform storage for web and React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage keys
export const STORAGE_KEYS = {
  CONFIG: '@polish_timer:config',
  CURRENT_SESSION: '@polish_timer:current_session',
  SESSION_HISTORY: '@polish_timer:history',
} as const;

/**
 * Cross-platform storage utility
 * Uses AsyncStorage for React Native and localStorage for web
 */
class Storage {
  private isWeb = Platform.OS === 'web';

  /**
   * Get item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      let value: string | null = null;

      if (this.isWeb && typeof window !== 'undefined' && window.localStorage) {
        value = window.localStorage.getItem(key);
      } else {
        value = await AsyncStorage.getItem(key);
      }

      if (value !== null) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Set item in storage
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);

      if (this.isWeb && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, jsonValue);
      } else {
        await AsyncStorage.setItem(key, jsonValue);
      }
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      if (this.isWeb && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    try {
      if (this.isWeb && typeof window !== 'undefined' && window.localStorage) {
        // Only clear our keys, not all localStorage
        Object.values(STORAGE_KEYS).forEach(key => {
          window.localStorage.removeItem(key);
        });
      } else {
        await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      }
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
}

export const storage = new Storage();